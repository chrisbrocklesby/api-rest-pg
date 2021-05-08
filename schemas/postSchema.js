module.exports = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
    title: { type: 'string' },
    body: { type: 'string' },
  },
  required: ['title', 'body'],
};
