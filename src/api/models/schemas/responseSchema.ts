export const responseSchema = {
  type: 'object',
  properties: {
    code: { type: 'number' },
    type: { type: 'string' },
    message: { type: 'string' }
  },
  required: ['code', 'type', 'message'],
  additionalProperties: true
};
