module.exports = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 5,
      maxLength: 30,
    },
    token: {
      type: 'string',
    },
  },
  required: ['email', 'password'],
};
