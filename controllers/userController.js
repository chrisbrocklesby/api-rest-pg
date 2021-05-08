const userService = require('../services/userService');
const config = require('../config');

module.exports = {
  register: async (request, response, next) => {
    try {
      const register = await userService.register(request.body);
      // eslint-disable-next-line no-console
      console.log('Send email confirm: ', register.token);

      return response.json({ data: { register: 'success' } });
    } catch (error) {
      return next(error);
    }
  },

  login: async (request, response, next) => {
    try {
      const login = await userService.login(request.body);

      response.cookie('token', login.token, {
        httpOnly: true,
        secure: (config.enviroment !== 'development'),
        sameSite: 'strict',
        expires: new Date(Number(new Date()) + 2592000000),
      });

      return response.json({ data: { login: 'success' } });
    } catch (error) {
      return next(error);
    }
  },

  logout: async (request, response, next) => {
    try {
      response.clearCookie('token');
      return response.json({ data: { logout: 'success' } });
    } catch (error) {
      return next(error);
    }
  },

  revoke: async (request, response, next) => {
    try {
      response.clearCookie('token');
      return response.json({ data: await userService.revoke(request.user.id || null) });
    } catch (error) {
      return next(error);
    }
  },

  verify: async (request, response, next) => {
    try {
      const { id, token } = request.query;
      return response.json({ data: await userService.verify(id, token) });
    } catch (error) {
      return next(error);
    }
  },

  auth: async (request, response, next) => {
    try {
      const { token } = request.cookies;
      const auth = await userService.auth(token);

      if (auth.refresh) {
        response.cookie('token', auth.refresh, {
          httpOnly: true,
          secure: (config.enviroment !== 'development'),
          sameSite: 'strict',
          expires: new Date(Number(new Date()) + 2592000000),
        });
      }

      request.user = auth.user;
      return next();
    } catch (error) {
      return next(error);
    }
  },
};
