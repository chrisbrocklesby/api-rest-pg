const config = require('../config');

module.exports = {
  notFound: (request, response, next) => {
    response.status(404)
      .json({
        error: {
          name: 'notFound',
          message: 'Not Found',
        },
      });
    next();
  },

  error: (error, request, response, next) => {
    const codes = {
      authError: 401,
      validationError: 400,
      badRequest: 400,
      notFound: 404,
    };

    let status = error.status || 500;
    Object.keys(codes).forEach((code) => {
      if (error.name === code) { status = codes[code]; }
    });

    if (config.enviroment !== 'development' && status === 500) {
      // eslint-disable-next-line no-console
      console.error({ error });
      response.status(status).json({
        error: {
          name: 'Error',
          message: 'Internal Server Error',
        },
      });
      next();
    } else {
      // eslint-disable-next-line no-console
      console.error({ error });
      response.status(status).json({
        error: {
          name: error.name || 'Error',
          message: error.message || 'Internal Server Error',
          ...error,
        },
      });
      next();
    }
  },
};
