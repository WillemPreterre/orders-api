import request from 'supertest';
import mongoose from 'mongoose';
import app, { connectDatabaseOrders, startServer } from '../index';

describe('API Server', () => {
  beforeAll(async () => {
    await connectDatabaseOrders();
    startServer();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should respond with 200 status code for /metrics', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
  });

  it('should respond with 404 status code for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });
});
