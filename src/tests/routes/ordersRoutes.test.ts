import request from 'supertest';
import app from '../../index';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;
let testToken: string;
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }
    testToken = jwt.sign(
        { userId: "67ab1abe5905025733f3661f", role: "api_client" },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );
    console.log('testToken', testToken);
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Orders Routes', () => {
    it('should get all orders', async () => {
        const res = await request(app).get('/api/orders').set("Authorization", `Bearer ${testToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a new order', async () => {
        const newOrder = {
            "items": [
                "67cd7eade42a44b0a158931a"
            ],
            "customerId": "1234",
            "totalAmount": 99.99,
            "status": "En cours de validation"
        };
        const res = await request(app).post('/api/orders/').send(newOrder).set("Authorization", `Bearer ${testToken}`);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
    });
    it('should get an order by id', async () => {
        const orderId = new mongoose.Types.ObjectId().toHexString();
        // Create an order first to ensure the orderId exists
        await request(app).post('/api/orders/').send({
            "items": ["67cd7eade42a44b0a158931a"],
            "customerId": "1234",
            "totalAmount": 99.99,
            "status": "En cours de validation",
            "_id": orderId
        }).set("Authorization", `Bearer ${testToken}`);

        const res = await request(app).get(`/api/orders/${orderId}`).set("Authorization", `Bearer ${testToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id', orderId);
    });
    it('should update an order', async () => {
        const newOrder = {
            "items": [
                "67cd7eade42a44b0a158931a"
            ],
            "customerId": "1234",
            "totalAmount": 99.99,
            "status": "En cours de validation"
        };
        const createdOrderRes = await request(app).post('/api/orders/').send(newOrder).set("Authorization", `Bearer ${testToken}`);
        const orderId = createdOrderRes.body._id;

        const updatedOrder = {
            "items": [
                "67cd7eade42a44b0a158931a"
            ],
            "customerId": "1234",
            "totalAmount": 79.99,
            "status": "En cours de validation"
        };
        const res = await request(app).put(`/api/orders/${orderId}`).send(updatedOrder).set("Authorization", `Bearer ${testToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id', orderId);
    });

    it('should delete an order', async () => {
        const orderId = '67ce4f3602c60b02f0c6d4d4'; // Replace with a valid order ID
        // Create an order first to ensure the orderId exists
        await request(app).post('/api/orders/').send({
            "items": ["67cd7eade42a44b0a158931a"],
            "customerId": "1234",
            "totalAmount": 99.99,
            "status": "En cours de validation",
            "_id": orderId
        }).set("Authorization", `Bearer ${testToken}`);

        const res = await request(app).delete(`/api/orders/${orderId}`).set("Authorization", `Bearer ${testToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Commande supprimée');
    });

});