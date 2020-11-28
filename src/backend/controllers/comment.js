import router from 'koa-joi-router';
import { getLogger } from '../log.js';

const log = getLogger('backend:controller:comment');
// eslint-disable-next-line no-unused-vars
const Joi = router.Joi;

// eslint-disable-next-line no-unused-vars
export default function controller(commentsModel, thisUser) {
  const commentsRouter = router();

  commentsRouter.route({
    method: 'post',
    path: '/comments',
    // pre:thisUserthisUser.can('access private pages'),
    // validate: {
    //   body: Joi.object({
    //     title: Joi.string(),
    //     contents: Joi.string(),
    //     author: Joi.number().integer(),
    //   }),
    //   type: 'json',
    //   failure: 400,
    //   continueOnError: true,
    // },
    handler: async ctx => {
      log.debug(`Posting a new comment.`);
      // eslint-disable-next-line no-unused-vars
      let newComment, fid;

      ctx.params.fid ? fid = ctx.params.fid : null

      try {
        newComment = commentsModel.create(ctx.request.body);
        await commentsModel.persistAndFlush(newComment);
      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse comment schema: ${err}`);
      }
    
      ctx.body = {
        status: 201,
        message: 'created', 
        data: newComment
      }
      ctx.status = 201; // created
    },
  });

  commentsRouter.route({
    method: 'get',
    path: '/comments',
    // pre: {},
    // validate: {},
    handler: async ctx => {
      log.debug(`Retrieving comments.`);
      let comments;

      try {
        comments = await commentsModel.findAll();
      } catch (err) {
        log.error('HTTP 400 error: ', err);
        ctx.throw(400, `Failed to retrieve comments`);
      }

      ctx.status = 200;
      ctx.response.body = {
        status: 200,
        message: "ok", 
        data: comments
      }
    }
  });

  commentsRouter.route({
    method: 'get',
    path: '/comments/:id',
    // pre:thisUserthisUser.can('access private pages'),
    // validate: { },
    handler: async ctx => {
      log.debug(`Retrieving comment ${ctx.params.id}.`);
      let comment;
      
      try {
        comment = await commentsModel.findOne(ctx.params.id);
        
        if (!comment) {
          ctx.throw(404, `A comment with ID ${ctx.params.id} doesn't exist`)
        }

      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse comment schema: ${err}`);
      }

      ctx.status = 200;
      ctx.response.body = {
        status: 200,
        message: "ok",
        data: comment
      }
    },
  });

  commentsRouter.route({
    method: 'put',
    path: '/comments/:id',
    // pre:thisUserthisUser.can('access private pages'),
    // validate: {
    //   body: Joi.object({
    //     title: Joi.string(),
    //     contents: Joi.string(),
    //     author: Joi.number().integer(),
    //   }),
    //   type: 'json',
    //   failure: 400,
    //   continueOnError: true,
    // },
    handler: async ctx => {
      log.debug(`Updating comment ${ctx.params.id}.`);
      let comment;
      
      try {
        comment = await commentsModel.findOne(ctx.params.id);

        if (!comment) {
          ctx.throw(404, `A comment with ID ${ctx.params.id} doesn't exist`)
        }
        
        commentsModel.assign(comment, ctx.request.body);
        await commentsModel.persistAndFlush(comment);

      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse comment schema: ${err}`);
      }

      // if updated
      ctx.status = 204; 
    },
  });

  commentsRouter.route({
    method: 'delete',
    path: '/comments/:id',
    // pre: thisUser.can('');
    // validate: {},
    handler: async ctx => {
      log.debug(`Removing comment with ID ${ctx.params.id}`)
      let comment;

      try {
        comment = await commentsModel.findOne(ctx.params.id);
        
        if (!comment) {
          ctx.throw(404, `A comment with ID ${ctx.params.id} doesn't exist`)
        }

        await commentsModel.removeAndFlush(comment)

      } catch (err) {
        log.error('HTTP 400 Error: ', err);
        ctx.throw(400, `Failed to parse comment schema: ${err}`);
      }

      // if deleted
      ctx.status = 204
    }
  })

  return commentsRouter;
}
