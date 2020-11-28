import router from 'koa-joi-router';
import { getLogger } from '../log.js';
import handleValidationError from '../utils/errors.js';
import resolve from '../utils/resolve.js';

const log = getLogger('backend:controllers:preprint');
const Joi = router.Joi;

const querySchema = Joi.object({
  start: Joi.number()
    .integer()
    .greater(-1),
  end: Joi.number()
    .integer()
    .positive(),
  asc: Joi.boolean(),
  sort_by: Joi.string(),
  from: Joi.string(),
  to: Joi.string(),
});

const preprintSchema = {};

// eslint-disable-next-line no-unused-vars
export default function controller(preprints, thisUser) {
  const preprintRoutes = router();

  // RESOLVE PREPRINT METADATA
  preprintRoutes.route({
    meta: {
      swagger: {
        summary: 'Endpoint to GET and resolve preprint metadata',
      },
    },
    method: 'get',
    path: '/resolve',
    handler: async ctx => {
      const { identifier } = ctx.query;
      log.debug(`Resolving preprint with ID: ${identifier}`);
      let data;
      try {
        data = await resolve(identifier);
        if (data) {
          const preprint = preprints.create(data);
          await preprints.persistAndFlush(preprint);
        }
      } catch (err) {
        log.error(`Preprint resolution failed: ${err}`);
        ctx.throw(400, `Preprint resolution failed: ${err}`);
      }

      if (!data) ctx.throw(404, 'No preprint found.');
      ctx.body = data;
    },
  });

  // POST
  preprintRoutes.route({
    meta: {
      swagger: {
        summary: 'Endpoint to POST a new preprint',
      },
    },
    method: 'post',
    path: '/preprints',
    validate: {
      body: Joi.object({
        data: preprintSchema,
      }), // #TODO
      type: 'json',
      continueOnError: true,
    },
    // pre:thisUserthisUser.can('access private pages'),
    handler: async (ctx, next) => {
      if (ctx.invalid) {
        log.error('This is the error object', '\n', ctx.invalid);
        ctx.response.status = 400;
        handleValidationError(ctx);
        return next();
      }

      log.debug('Adding new preprint.');
      let preprint;

      try {
        preprint = preprints.create(ctx.request.body.data[0]);
        await preprints.persistAndFlush(preprint);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to add preprint: ${err}`);
      }

      ctx.response.status = 201;
      ctx.body = {
        statusCode: 201,
        status: 'created',
        data: preprint,
      };
    },
  });

  // GET
  preprintRoutes.route({
    meta: {
      swagger: {
        summary: 'Endpoint to GET multiple preprints',
      },
    },
    method: 'get',
    path: '/preprints',
    validate: {
      query: querySchema,
      validate: {
        output: {
          200: {
            body: {
              statusCode: 200,
              status: 'ok',
              data: preprintSchema,
            },
          },
        },
        continueOnError: true,
      },
    },
    handler: async (ctx, next) => {
      if (ctx.invalid) {
        log.error('400 Error! This is the error object', '\n', ctx.invalid);
        ctx.response.status = 400;
        handleValidationError(ctx);
        return next();
      }

      log.debug(`Retrieving preprints.`);

      try {
        const allPreprints = await preprints.findAll([
          'fullReviews',
          'rapidReviews',
          'requests',
        ]);
        if (allPreprints) {
          ctx.body = {
            statusCode: 200,
            status: 'ok',
            data: allPreprints,
          };
        }
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }
    },
  });

  preprintRoutes.route({
    meta: {
      swagger: {
        summary: 'Endpoint to GET a single preprint',
      },
    },
    method: 'get',
    path: '/preprints/:id',
    validate: {
      params: {
        id: Joi.alternatives().try(Joi.number().integer(), Joi.string()),
      },
      //output: {
      //  200: {
      //    body: {
      //      statusCode: 200,
      //      status: 'ok',
      //      data: preprintSchema,
      //    },
      //  },
      //},
      failure: 400,
      continueOnError: true,
    },
    handler: async (ctx, next) => {
      if (ctx.invalid) {
        log.error('400 Error! This is the error object', '\n', ctx.invalid);
        handleValidationError(ctx);
        return next();
      }

      log.debug(`Retrieving preprint ${ctx.params.id}.`);
      let preprint;

      try {
        preprint = await preprints.findOneByIdOrHandle(ctx.params.id, [
          'fullReviews',
          'rapidReviews',
          'requests',
        ]);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }

      if (preprint) {
        ctx.response.body = { statusCode: 200, status: 'ok', data: [preprint] };
        ctx.response.status = 200;
      } else {
        log.error(
          `HTTP 404 Error: That preprint with ID ${
            ctx.params.id
          } does not exist.`,
        );

        ctx.response.status = 404;

        ctx.body = {
          statusCode: 404,
          status: `HTTP 404 Error.`,
          message: `That preprint with ID ${ctx.params.id} does not exist.`,
        };
      }
    },
  });

  preprintRoutes.route({
    meta: {
      swagger: {
        summary: 'Endpoint to PUT updates on preprints',
      },
    },
    method: 'put',
    path: '/preprints/:id',
    validate: {
      params: {
        id: Joi.alternatives().try(Joi.number().integer(), Joi.string()),
      },
      body: {
        data: preprintSchema,
      },
      type: 'json',
      failure: 400,
      continueOnError: true,
    },
    // pre:thisUserthisUser.can('access admin pages'),
    handler: async ctx => {
      log.debug(`Updating preprint ${ctx.params.id}.`);
      let preprint;

      try {
        preprint = preprints.findOneByIdOrHandle(ctx.params.id);
        await preprints.persistAndFlush(ctx.request.body.data[0]);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }

      if (preprint) {
        ctx.response.body = { statusCode: 200, status: 'ok', data: preprint };
        ctx.response.status = 200;
      } else {
        log.error(
          `HTTP 404 Error: That preprint with ID ${
            ctx.params.id
          } does not exist.`,
        );
        ctx.throw(
          404,
          `That preprint with ID ${ctx.params.id} does not exist.`,
        );
      }
    },
  });

  preprintRoutes.route({
    meta: {
      swagger: {
        summary: 'Endpoint to delete preprints',
      },
    },
    method: 'delete',
    path: '/preprints/:id',
    validate: {
      params: {
        id: Joi.alternatives().try(Joi.number().integer(), Joi.string()),
      },
    },
    // pre:thisUserthisUser.can('access admin pages'),
    handler: async ctx => {
      log.debug(`Deleting preprint ${ctx.params.id}.`);
      let preprint;

      try {
        preprint = preprints.findOneByIdOrHandle(ctx.params.id);
        await preprints.removeAndFlush(preprint);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }

      if (preprint.length && preprint.length > 0) {
        ctx.response.body = { status: 'success', data: preprint };
        ctx.response.status = 200;
      } else {
        log.error(
          `HTTP 404 Error: That preprint with ID ${
            ctx.params.id
          } does not exist.`,
        );
        ctx.throw(
          404,
          `That preprint with ID ${ctx.params.id} does not exist.`,
        );
      }
    },
  });

  return preprintRoutes;
}
