import router from 'koa-joi-router';
import moment from 'moment';
import { getLogger } from '../log.js';

const Joi = router.Joi;
const log = getLogger('backend:controllers:group');

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

/**
 * Initialize the group auth controller
 *
 * @param {Object} groups - User model
 * @returns {Object} Auth controller Koa router
 */

// eslint-disable-next-line no-unused-vars
export default function controller(groups, thisUser) {
  const groupRoutes = router();

  groupRoutes.route({
    method: 'post',
    path: '/groups',
    validate: {
      body: {},
      type: 'json',
    },
    pre: thisUser.can('access admin pages'),
    handler: async ctx => {
      log.debug('Adding new group.');
      let group;

      try {
        group = await groups.create(ctx.request.body.data);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse group schema: ${err}`);
      }
      ctx.response.body = { statusCode: 201, status: 'created', data: group };
      ctx.response.status = 201;
    },
  });

  groupRoutes.route({
    method: 'get',
    path: '/groups',
    validate: {
      query: querySchema,
    },
    pre: thisUser.can('access admin pages'),
    handler: async ctx => {
      log.debug(`Retrieving groups.`);
      let res;

      try {
<<<<<<< HEAD
        const query = ctx.query;
=======
>>>>>>> mikro-orm
        let from, to;
        if (ctx.query.from) {
          const timestamp = moment(ctx.query.from);
          if (timestamp.isValid()) {
            log.error('HTTP 400 Error: Invalid timestamp value.');
            ctx.throw(400, 'Invalid timestamp value.');
          }
          from = timestamp.toISOString();
        }
        if (ctx.query.to) {
          const timestamp = moment(ctx.query.to);
          if (timestamp.isValid()) {
            log.error('HTTP 400 Error: Invalid timestamp value.');
            ctx.throw(400, 'Invalid timestamp value.');
          }
          to = timestamp.toISOString();
        }
<<<<<<< HEAD
        res = await groups.findAll({
          start: query.start,
          end: query.end,
          asc: query.asc,
          sort_by: query.sort_by,
=======
        res = await groups.find({
          start: ctx.query.start,
          end: ctx.query.end,
          asc: ctx.query.asc,
          sort_by: ctx.query.sort_by,
>>>>>>> mikro-orm
          from: from,
          to: to,
        });
        ctx.response.body = {
          statusCode: 200,
          status: 'ok',
          data: res,
        };
        ctx.response.status = 200;
      } catch (err) {
        ctx.throw(400, `Failed to parse query: ${err}`);
      }
    },
  });

  groupRoutes.route({
    method: 'get',
    path: '/groups/:id',
<<<<<<< HEAD
    pre: thisUser.can('access private pages'),
=======
    pre: async () => {
      thisUser.can('access private pages');
    },
>>>>>>> mikro-orm
    handler: async ctx => {
      log.debug(`Retrieving group ${ctx.params.id}.`);
      let group;

      try {
        group = await groups.findOne(ctx.params.id);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }

      if (group.length) {
        ctx.response.body = { statusCode: 200, status: 'ok', data: group };
        ctx.response.status = 200;
      } else {
        log.error(
          `HTTP 404 Error: That group with ID ${ctx.params.id} does not exist.`,
        );
        ctx.throw(404, `That group with ID ${ctx.params.id} does not exist.`);
      }
    },
  });

  groupRoutes.route({
    method: 'put',
    path: '/groups/:id',
<<<<<<< HEAD
    pre: thisUser.can('access admin pages'),
=======
    pre: async () => {
      thisUser.can('access admin pages');
    },
>>>>>>> mikro-orm
    handler: async ctx => {
      log.debug(`Updating group ${ctx.params.id}.`);
      let group;

      try {
        group = groups.assign(ctx.params.id, ctx.request.body.data);
        groups.persistAndFlush(group);

        // workaround for sqlite
        if (Number.isInteger(group)) {
          group = await groups.findById(ctx.param.id);
        }
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }

      if (group.length) {
        ctx.response.body = { statusCode: 200, status: 'ok', data: group };
        ctx.response.status = 200;
      } else {
        log.error(
          `HTTP 404 Error: That group with ID ${ctx.params.id} does not exist.`,
        );
        ctx.throw(404, `That group with ID ${ctx.params.id} does not exist.`);
      }
    },
  });

  groupRoutes.route({
    method: 'delete',
    path: '/groups/:id',
<<<<<<< HEAD
    pre: thisUser.can('access admin pages'),
=======
    pre: async () => {
      thisUser.can('access admin pages');
    },
>>>>>>> mikro-orm
    handler: async ctx => {
      log.debug(`Deleting group ${ctx.params.id}.`);
      let group;

      try {
        group = groups.remove(ctx.params.id);
        await groups.persistAndFlush(group);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }

      if (group.length) {
        ctx.response.body = { statusCode: 200, status: 'ok', data: group };
        ctx.response.status = 200;
      } else {
        log.error(
          `HTTP 404 Error: That group with ID ${ctx.params.id} does not exist.`,
        );
        ctx.throw(404, `That group with ID ${ctx.params.id} does not exist.`);
      }
    },
  });

  groupRoutes.route({
    method: 'get',
    path: '/groups/:id/members',
<<<<<<< HEAD
    validate: {
      query: querySchema,
=======
    pre: async () => {
      thisUser.can('access admin pages');
>>>>>>> mikro-orm
    },
    pre: thisUser.can('access admin pages'),
    handler: async ctx => {
      log.debug(`Retrieving members of group ${ctx.params.id}.`);
      let group;

      try {
<<<<<<< HEAD
        const query = ctx.query;
=======
>>>>>>> mikro-orm
        group = await groups.members({
          gid: ctx.params.id,
          start: ctx.query.start,
          end: ctx.query.end,
          asc: ctx.query.asc,
        });
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }

      if (group.length) {
        ctx.response.body = { statusCode: 200, status: 'ok', data: group };
        ctx.response.status = 200;
      } else {
        log.error(
          `HTTP 404 Error: That group with ID ${ctx.params.id} does not exist.`,
        );
        ctx.throw(404, `That group with ID ${ctx.params.id} does not exist.`);
      }
    },
  });

  groupRoutes.route({
    method: 'put',
    path: '/groups/:id/members/:uid',
<<<<<<< HEAD
    pre: thisUser.can('access admin pages'),
=======
    pre: async () => {
      thisUser.can('access admin pages');
    },
>>>>>>> mikro-orm
    handler: async ctx => {
      log.debug(`Adding user ${ctx.params.uid} to group ${ctx.params.id}.`);
      let res;

      try {
        res = await groups.memberAdd(ctx.params.id, ctx.params.uid);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }

      if (res) {
        ctx.response.body = { statusCode: 201, status: 'created', data: res };
        ctx.response.status = 201;
      } else {
        log.error(
          `HTTP 404 Error: That mapping with gid ${ctx.params.id} and uid ${
            ctx.params.uid
          } does not exist.`,
        );
        ctx.throw(
          404,
          `That mapping with gid ${ctx.params.id} and uid ${
            ctx.params.uid
          } does not exist.`,
        );
      }
    },
  });

  groupRoutes.route({
    method: 'delete',
    path: '/groups/:id/members/:uid',
<<<<<<< HEAD
    pre: thisUser.can('access admin pages'),
=======
    pre: async () => {
      thisUser.can('access admin pages');
    },
>>>>>>> mikro-orm
    handler: async ctx => {
      log.debug(`Removing user ${ctx.params.uid} from group ${ctx.params.id}.`);
      let res;

      try {
        res = await groups.memberRemove(ctx.params.id, ctx.params.uid);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse query: ${err}`);
      }

      if (res) {
        ctx.response.body = { statusCode: 200, status: 'ok', data: res };
        ctx.response.status = 200;
      } else {
        log.error(
          `HTTP 404 Error: That mapping with gid ${ctx.params.id} and uid ${
            ctx.params.uid
          } does not exist.`,
        );
        ctx.throw(
          404,
          `That mapping with gid ${ctx.params.id} and uid ${
            ctx.params.uid
          } does not exist.`,
        );
      }
    },
  });

  return groupRoutes;
}
