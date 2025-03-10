import amqp from 'amqplib';

let channel: amqp.Channel | null = null;

export const rabbitMQConnection = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI as string);
    channel = await connection.createChannel();
    console.log("Connecté à RabbitMQ");
  } catch (err) {
    console.error("Erreur de connexion à RabbitMQ :", err);
  }
};

export const getChannel = (): amqp.Channel | null => {
  return channel;
};

export const publishToQueue = async (queueName: string, message: string): Promise<void> => {
  const channel = getChannel();
  if (!channel) {
    throw new Error("Le canal RabbitMQ n'est pas initialisé");
  }
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
};
