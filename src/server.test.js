import 'core-js/stable';
import 'regenerator-runtime/runtime';
const request = require('supertest');
import app from './server';

describe('Server', () => {
  test('handles reqests to \'/\'', async () => {
    const res = await request(app)
      .get('/')
    
    expect(res.statusCode).toEqual(227);
  });
});
