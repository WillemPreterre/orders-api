import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../../controllers/ordersController';
import OrderModel from '../../models/ordersModel';
import { publishToQueue } from '../../utils/rabbitmq';

jest.mock('../../models/ordersModel');
jest.mock('../../utils/rabbitmq');

jest.mock('amqplib', () => ({
    connect: jest.fn().mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue({
        assertQueue: jest.fn(),
        sendToQueue: jest.fn(),
        consume: jest.fn(),
      }),
      close: jest.fn().mockResolvedValue(undefined),
    }),
  }));
  
describe('Orders Controller', () => {
    it('should get all orders', async () => {
        const req = {} as any;
        const res = { json: jest.fn() } as any;
        (OrderModel.find as jest.Mock).mockResolvedValue([]);
        await getOrders(req, res);
        expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should get an order by id', async () => {
        const req = { params: { id: '12345' } } as any;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
        (OrderModel.findById as jest.Mock).mockResolvedValue({ _id: '12345' });
        await getOrderById(req, res);
        expect(res.json).toHaveBeenCalledWith({ _id: '12345' });
    });

    it('should return 404 when order not found by id', async () => {
        const req = { params: { id: '12345' } } as any;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
        (OrderModel.findById as jest.Mock).mockResolvedValue(null);
        await getOrderById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Commande introuvable" });
    });

    it('should create a new order', async () => {
        const req = {
            body: {
                "items": ["67cd7eade42a44b0a158931a"],
                "customerId": "1234",
                "totalAmount": 99.99,
                "status": "En cours de livraison"
            }
        } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        OrderModel.prototype.save.mockResolvedValue({ _id: '12345' });
        await createOrder(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ _id: '12345' });
    });

    it('should create a new order and publish a message to RabbitMQ', async () => {
        const req = {
            body: {
                "items": ["67cd7eade42a44b0a158931a"],
                "customerId": "1234",
                "totalAmount": 99.99,
                "status": "En cours de livraison"
            }
        } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        OrderModel.prototype.save.mockResolvedValue({ _id: '12345' });
        await createOrder(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ _id: '12345' });
        expect(publishToQueue).toHaveBeenCalledWith("orders_created", JSON.stringify({ _id: '12345' }));
    });

    it('should update an order', async () => {
        const req = { params: { id: '12345' }, body: { "status": "Livré" } } as any;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
        (OrderModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: '12345', status: "Livré" });
        await updateOrder(req, res);
        expect(res.json).toHaveBeenCalledWith({ _id: '12345', status: "Livré" });
    });

    it('should return 404 when updating a non-existent order', async () => {
        const req = { params: { id: '12345' }, body: { "status": "Livré" } } as any;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
        (OrderModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
        await updateOrder(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Commande introuvable" });
    });

    it('should delete an order', async () => {
        const req = { params: { id: '12345' } } as any;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
        (OrderModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '12345' });
        await deleteOrder(req, res);
        expect(res.json).toHaveBeenCalledWith({ message: "Commande supprimée" });
    });

    it('should return 404 when deleting a non-existent order', async () => {
        const req = { params: { id: '12345' } } as any;
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
        (OrderModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
        await deleteOrder(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Commande introuvable" });
    });
});
