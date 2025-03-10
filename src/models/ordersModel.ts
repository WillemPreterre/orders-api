import mongoose, { Schema, Document } from 'mongoose';

// Interface pour une commande
export interface Order extends Document {
  _id: mongoose.Types.ObjectId;
  items: string[];
  totalAmount: number;
  customerId: string;
  status: 'En cours de validation' | 'Expédié';
  createdAt: Date;
  updatedAt: Date;
}

// Définition du schéma Mongoose
const OrderSchema = new Schema<Order>(
  {
    items: { type: [String], required: true },
    totalAmount: { type: Number, required: true },
    customerId: { type: String, required: true },
    status: { type: String, enum: ['En cours de validation', 'Expédié'], default: 'En cours de validation' },
  },
  { timestamps: true } // Active les champs `createdAt` et `updatedAt`
);

// Création du modèle Mongoose
const OrderModel = mongoose.model<Order>('Order', OrderSchema);

export default OrderModel;
