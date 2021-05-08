const postService = require('../services/postService');

module.exports = {
  create: async (request, response, next) => {
    try {
      return response.json({ data: await postService.create(request.body) });
    } catch (error) {
      return next(error);
    }
  },

  readAll: async (request, response, next) => {
    try {
      return response.json({ data: await postService.readAll(request.query.page) });
    } catch (error) {
      return next(error);
    }
  },

  readById: async (request, response, next) => {
    try {
      const post = await postService.readById(request.params.id);
      if (!post) {
        return next();
      }
      return response.json({ data: post });
    } catch (error) {
      return next(error);
    }
  },

  update: async (request, response, next) => {
    try {
      const post = await postService.update(request.params.id, request.body);
      if (!post) {
        return next();
      }
      return response.json({ data: post });
    } catch (error) {
      return next(error);
    }
  },

  delete: async (request, response, next) => {
    try {
      const post = await postService.delete(request.params.id);
      if (!post) {
        return next();
      }
      return response.json({ data: post });
    } catch (error) {
      return next(error);
    }
  },
};
