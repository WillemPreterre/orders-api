import request from 'supertest';
import express, { Request, Response } from 'express';
import { metricsMiddleware, metricsRoute } from '../utils/metrics';

const app = express();
app.use(metricsMiddleware);
app.get('/metrics', metricsRoute);


describe('Metrics Middleware and Route', () => {
  it('should count HTTP requests', async () => {
    await request(app).get('/test-route').expect(404);
    await request(app).get('/metrics').expect(200).then(response => {
      expect(response.text).toContain('http_requests_total');
    });
  });

  it('should expose metrics on /metrics route', async () => {
    await request(app).get('/metrics').expect(200).then(response => {
      expect(response.headers['content-type']).toBe('text/plain; charset=utf-8; version=0.0.4');
      expect(response.text).toContain('http_requests_total');
    });
  });
});
