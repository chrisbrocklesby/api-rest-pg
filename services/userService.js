const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const utils = require('../utils');
const userModel = require('../models/userModel');
const userSchema = require('../schemas/userSchema');

const createToken = Math.random().toString(36).substring(2, 12);

module.exports = {
  register: async (data) => {
    utils.validate(data, userSchema);

    const user = await userModel.selectByEmail(data.email);
    if (user) {
      throw Object({
        name: 'badRequest',
        message: 'User email conflict',
      });
    }

    return userModel.insert({
      id: data.id || utils.uuid(),
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      token: createToken,
    });
  },

  login: async (data) => {
    utils.validate(data, userSchema);

    const user = await userModel.selectByEmail(data.email);
    if (!user) {
      throw Object({
        name: 'authError',
        message: 'User email not found',
      });
    }

    if (!user.verified) {
      throw Object({
        name: 'authError',
        message: 'User email not verified',
      });
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw Object({
        name: 'authError',
        message: 'User password not valid',
      });
    }

    if (!user.token) {
      await userModel.update(user.id, { token: createToken, updatedAt: 'now()' });
    }

    return {
      token: jwt.sign({
        id: user.id,
        email: user.email,
        token: user.token,
      }, config.jwt.accessKey || '', { expiresIn: config.jwt.expires || '1h' }),
    };
  },

  verify: async (id, token) => {
    utils.validate(
      { id, token },
      { ...userSchema, required: ['id', 'token'] },
    );

    const user = await userModel.selectById(id);

    if (user.verified) {
      throw Object({
        name: 'badRequest',
        message: 'User already verified',
      });
    }

    if (!user.token || user.token !== token) {
      throw Object({
        name: 'badRequest',
        message: 'User could not be verified',
      });
    }

    const update = await userModel.update(id, { verified: true, token: null, updatedAt: 'now()' });
    return { id: update.id };
  },

  auth: (token) => jwt.verify(token, config.jwt.accessKey, { ignoreExpiration: true },
    async (error, decoded) => {
      if (error) {
        throw Object({
          name: 'authError',
          message: error.message,
        });
      }

      const auth = { user: decoded };
      delete auth.user.token;
      delete auth.user.iat;
      delete auth.user.exp;

      if (decoded.exp < new Date().getTime() / 1000) {
        const user = await userModel.selectById(decoded.id);
        if (!user || user.token !== decoded.token) {
          throw Object({
            name: 'authError',
            message: 'User token is invalid or revoked',
          });
        }
        auth.refresh = jwt.sign({
          id: user.id,
          email: user.email,
          token: user.token,
        }, config.jwt.accessKey || '', { expiresIn: config.jwt.expires || '1h' });
      }

      return auth;
    }),

  revoke: async (id) => {
    const user = await userModel.update(id, { token: null });
    return { id: user.id };
  },
};
