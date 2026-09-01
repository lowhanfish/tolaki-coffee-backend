export const createProfile = {
    type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        brand: {
          type: 'string',
        },
        quotes: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        detail: {
          type: 'string',
        },
      }
}