import { rabbitMQConnection, getChannel, closeRabbitMQConnection, publishToQueue } from '../utils/rabbitmq';

describe('RabbitMQ Utility Functions', () => {
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await rabbitMQConnection();
    });

    afterAll(async () => {
        await closeRabbitMQConnection();
    });

    test('should not connect to RabbitMQ in test mode', async () => {
        await rabbitMQConnection();
        const channel = getChannel();
        expect(channel).toBeUndefined();
    });

    test('should throw error when publishing to queue in test mode', async () => {
        await expect(publishToQueue('testQueue', 'testMessage')).rejects.toThrow('Le canal RabbitMQ n\'est pas initialisé');
    });

    test('should connect to RabbitMQ in non-test mode', async () => {
        process.env.NODE_ENV = 'development';
        await rabbitMQConnection();
        const channel = getChannel();
        expect(channel).not.toBeNull();
    });
});
