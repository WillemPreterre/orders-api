import { rabbitMQConnection, publishToQueue,closeRabbitMQConnection } from "../utils/rabbitmq";
import amqplib from "amqplib";

jest.mock("amqplib");
jest.mock("../models/ordersModel", () => ({
    findOne: jest.fn().mockResolvedValue({
        _id: "67cc71b2a4f85c3294e9b04a",
        stock: 10,
        save: jest.fn().mockResolvedValue(true)
    })
}));

describe("RabbitMQ Utils", () => {
    let mockChannel: any;
    let mockConnection: any;

    beforeAll(async () => {
        mockChannel = {
            assertQueue: jest.fn(),
            sendToQueue: jest.fn(),
        };
        mockConnection = {
            createChannel: jest.fn().mockResolvedValue(mockChannel),
        };

        (amqplib.connect as jest.Mock).mockResolvedValue(mockConnection);
        await rabbitMQConnection();
    });
    afterAll(async () => {
        await closeRabbitMQConnection();
      });
    test('rabbitMQConnection doit gérer une erreur de connexion', async () => {
        (amqplib.connect as jest.Mock).mockRejectedValue(new Error('Échec de connexion à RabbitMQ'));
    
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    
        await rabbitMQConnection();
    
        expect(consoleErrorMock).toHaveBeenCalledWith("Erreur de connexion à RabbitMQ :", expect.any(Error));
    
        consoleErrorMock.mockRestore();
    });
    
    it(" Devrait se connecter à RabbitMQ", async () => {
        expect(amqplib.connect).toHaveBeenCalled();
        expect(mockConnection.createChannel).toHaveBeenCalled();
    });

    it("Devrait envoyer un message à la queue", async () => {
        await publishToQueue("test_queue", "Hello, RabbitMQ!");
        expect(mockChannel.assertQueue).toHaveBeenCalledWith("test_queue", { durable: true });
        expect(mockChannel.sendToQueue).toHaveBeenCalledWith("test_queue", Buffer.from("Hello, RabbitMQ!"), { persistent: true });
    });

});