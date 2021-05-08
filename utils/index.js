const { v4: uuidv4 } = require('uuid');
const { validate } = require('jsonschema');

module.exports = {
  uuid: () => uuidv4(),
  validate: (data, schema) => {
    const errors = validate(data, schema).errors.map((item) => ({
      path: item.path[0] || item.argument || null,
      message: item.message,
    }));
    if (errors.length) {
      throw Object({
        name: 'validationError',
        message: errors,
      });
    }
  },
};
