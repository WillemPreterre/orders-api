import express, { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getOrders, createOrder, updateOrder, deleteOrder, getOrderById } from "../controllers/ordersController";
const router: Router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   - _id: "67ce5f4475a30fc2cd50bfec"
 *                     items: ["67cd7eade42a44b0a158931a"]
 *                     totalAmount: 99.99
 *                     customerId: "1234"
 *                     status: "En cours de validation"
 *                     createdAt: "2025-03-10T03:40:52.467Z"
 *                     updatedAt: "2025-03-10T03:40:52.467Z"
 *                     __v: 0
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retrieve an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: An order
 *         content:
 *           application/json:
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authMiddleware, getOrderById);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             example1:
 *               value:
 *                 items: ["67cd7eade42a44b0a158931a"]
 *                 customerId: "1234"
 *                 totalAmount: 99.99
 *                 status: "En cours de validation"
 *     responses:
 *       201:
 *         description: The created order
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   _id: "67ce5f4475a30fc2cd50bfec"
 *                   items: ["67cd7eade42a44b0a158931a"]
 *                   totalAmount: 99.99
 *                   customerId: "1234"
 *                   status: "En cours de validation"
 *                   createdAt: "2025-03-10T03:40:52.467Z"
 *                   updatedAt: "2025-03-10T03:40:52.467Z"
 *                   __v: 0
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             example1:
 *               value:
 *                 items: ["67cd7eade42a44b0a158931a"]
 *                 customerId: "1234"
 *                 totalAmount: 99.99
 *                 status: "En cours de validation"
 *     responses:
 *       200:
 *         description: The updated order
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   _id: "67ce5f4475a30fc2cd50bfec"
 *                   items: ["67cd7eade42a44b0a158931a"]
 *                   totalAmount: 99.99
 *                   customerId: "1234"
 *                   status: "En cours de validation"
 *                   createdAt: "2025-03-10T03:40:52.467Z"
 *                   updatedAt: "2025-03-10T03:40:52.467Z"
 *                   __v: 0
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authMiddleware, updateOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
