import { rabbitMQConnection, getChannel, closeRabbitMQConnection, publishToQueue } from '../utils/rabbitmq';
import amqplib, { Channel } from 'amqplib';

jest.mock('amqplib', () => {
  let mockChannel: Partial<Channel> | null = null;
  let mockConnection: any = null;
  return {
    connect: jest.fn().mockImplementation(async () => {
      if (!mockConnection) {
        mockChannel = {
          assertQueue: jest.fn(),
          sendToQueue: jest.fn(),
          consume: jest.fn(),
        };
        mockConnection = {
          createChannel: jest.fn().mockResolvedValue(mockChannel),
          close: jest.fn().mockResolvedValue(undefined),
        };
      }
      return mockConnection;
    }),
  };
});

describe('RabbitMQ Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not connect in test mode', async () => {
    process.env.NODE_ENV = 'test';
    console.log = jest.fn();
    await rabbitMQConnection();
    expect(console.log).toHaveBeenCalledWith("Mock RabbitMQ en mode test");
  });

  it('should connect to RabbitMQ successfully', async () => {
    process.env.NODE_ENV = 'development';
    console.log = jest.fn();
    await rabbitMQConnection();
    expect(console.log).toHaveBeenCalledWith("Connecté à RabbitMQ");
  });

  it('should handle connection errors', async () => {
    process.env.NODE_ENV = 'development';
    console.error = jest.fn();
    (amqplib.connect as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

    await rabbitMQConnection();
    expect(console.error).toHaveBeenCalledWith("Erreur de connexion à RabbitMQ", expect.any(Error));
  });

  it('should return the RabbitMQ channel', async () => {
    await rabbitMQConnection();
    const channel = getChannel();
    expect(channel).not.toBeNull();
    expect(typeof channel?.assertQueue).toBe('function');
  });


  it('should close the RabbitMQ connection successfully', async () => {
    console.log = jest.fn();
    await rabbitMQConnection(); 
    await closeRabbitMQConnection();
    expect(console.log).toHaveBeenCalledWith("Connexion RabbitMQ fermée.");
  });

  it('should publish a message to a queue', async () => {
    await rabbitMQConnection();
    const channel = getChannel();
    if (!channel) throw new Error("Le canal RabbitMQ n'est pas initialisé");

    await publishToQueue('testQueue', 'testMessage');

    expect(channel.assertQueue).toHaveBeenCalledWith('testQueue', { durable: true });
    expect(channel.sendToQueue).toHaveBeenCalledWith('testQueue', Buffer.from('testMessage'), { persistent: true });
  });
});
