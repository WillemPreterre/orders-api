import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { metricsMiddleware, metricsRoute } from "./utils/metrics";
import cors from "cors";
import bodyParser from "body-parser";
import ordersRoutes from "./routes/ordersRouter";
import { rabbitMQConnection } from "./utils/rabbitmq";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swaggerConfig";


dotenv.config();
const app = express();
// Middleware
app.use(metricsMiddleware);
// Exposer une route de métriques pour Prometheus
app.get('/metrics', metricsRoute);

app.use(bodyParser.json());
app.use("/api/orders", ordersRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Connexion à RabbitMQ
rabbitMQConnection()


// Connexion à MongoDB
export const connectDatabaseOrders = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connecté");
  } catch (err) {
    console.error("Erreur MongoDB :", err);
  }
};

export const startServer = (): void => {
  const PORT =
    process.env.NODE_ENV === "test" ? process.env.TEST_PORT : process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(` Métriques disponibles sur http://localhost:${PORT}/metrics`);
    console.log(` Swagger disponible sur http://localhost:${PORT}/api-docs`);
  });
};

if (require.main === module) {
  connectDatabaseOrders();
  startServer();
}

export default app;
