const utils = require('../utils');
const postModel = require('../models/postModel');
const postSchema = require('../schemas/postSchema');

module.exports = {
  create: (data) => {
    utils.validate(data, postSchema);

    return postModel.insert({
      id: data.id || utils.uuid(),
      ...data,
    });
  },

  readAll: (page) => postModel.selectAll(page),

  readById: (id) => {
    postSchema.required = [];
    utils.validate({ id }, postSchema);

    return postModel.selectById(id);
  },

  update: (id, data) => {
    postSchema.required = [];
    utils.validate({ id, ...data }, postSchema);

    if (data.id) {
      throw Object({
        name: 'badRequest',
        message: 'ID cannot be updated',
      });
    }

    return postModel.update(id, {
      ...data,
      updatedAt: 'now()',
    });
  },

  delete: (id) => {
    postSchema.required = [];
    utils.validate({ id }, postSchema);
    return postModel.delete(id);
  },
};
