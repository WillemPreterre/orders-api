import { Request, Response } from "express";
import mongoose from "mongoose";
import OrderModel from "../models/ordersModel";
import { publishToQueue } from "../utils/rabbitmq";
import logger from "../utils/logger";

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    const orders = await OrderModel.find();
    logger.info("Commandes récupérés");
    res.json(orders);

};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        res.status(404).json({ message: "Commande introuvable" });
        return;
    }
    logger.info("Commande récupéré");
    res.json(order);

};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    console.log("Création d'une commande avec les données :", req.body); 

    const newOrder = new OrderModel(req.body);
    const savedOrder = await newOrder.save();
    console.log('savedOrder',savedOrder)
    logger.info("Commande créée");

    try {
        await publishToQueue("orders_created", JSON.stringify(savedOrder));
        console.log('passage de la publication du message à RabbitMQ :');

    } catch (error) {
        console.log('Erreur lors de la publication du message à RabbitMQ :', error);
    }

    res.status(201).json(savedOrder);

};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
        res.status(404).json({ message: "Commande introuvable" });
        return;
    }
    logger.info("Commande modifié");

    res.json(updatedOrder);

};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id);
    logger.info("Commande supprimé avec succès");

    if (!deletedOrder) {
        res.status(404).json({ message: "Commande introuvable" });
        return;
    }
    res.json({ message: "Commande supprimée" });

};