import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Créer un registre de métriques
const register = new client.Registry();

// Ajouter les métriques par défaut
client.collectDefaultMetrics({ register });

// Définir une métrique personnalisée
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP reçus',
  labelNames: ['method', 'route', 'status_code']
});

// Ajouter la métrique au registre
register.registerMetric(httpRequestCounter);

// Middleware pour compter les requêtes HTTP
const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode.toString()).inc();
  });
  next();
};

// Route pour exposer les métriques
const metricsRoute = async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
};

// Exporter les fonctions correctement
export { metricsMiddleware, metricsRoute };
