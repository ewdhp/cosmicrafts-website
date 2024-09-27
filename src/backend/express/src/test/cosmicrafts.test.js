import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cosmicraftsRouter from '../../src/apis/cosmicrafts.js'; // Adjust the path as needed

// Mock the cosmicrafts object
jest.mock('../../../../declarations/cosmicrafts/index.js', () => ({
  cosmicrafts: {
    getAllPlayers: jest.fn().mockResolvedValue([
      { id: 1, name: 'Player1' },
      { id: 2, name: 'Player2' },
    ]),
  },
}));

const app = express();
app.use('/cosmicrafts', cosmicraftsRouter);

let server;

beforeAll((done) => {
  server = app.listen(3000, () => {
    console.log('Test server running on port 3000');
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    console.log('Test server closed');
    done();
  });
});

describe('GET /cosmicrafts/players', () => {
  it('should return a JSON response', async () => {
    const response = await request(app).get('/cosmicrafts/players');
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Body:', response.body);

    expect(response.status).toBe(201); // Expecting 201 status code
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toBeInstanceOf(Object);
  });
});