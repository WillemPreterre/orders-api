import amqplib, {  Connection,Channel } from 'amqplib';

let channel: Channel;

export const rabbitMQConnection = async () => {
  try {
      const connection = await amqplib.connect(process.env.RABBITMQ_URL as string);
      channel = await connection.createChannel();
      console.log("Connecté à RabbitMQ");
  } catch (error:any) {
      console.error("Erreur de connexion à RabbitMQ:", error.message);
      throw new Error("RabbitMQ Down");
  }
};
export const getChannel = (): amqplib.Channel | null => {
  return channel;
};
export const closeRabbitMQConnection = async (): Promise<void> => {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL as string);

  if (connection) {
    await connection.close();
    console.log("Connexion RabbitMQ fermée.");
  }
};
export const publishToQueue = async (queueName: string, message: string): Promise<void> => {
  const channel = getChannel();
  if (!channel) {
    throw new Error("Le canal RabbitMQ n'est pas initialisé");
  }
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
};
