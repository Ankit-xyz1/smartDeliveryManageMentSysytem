// models/Order.ts
import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true },
  customer: {
    name: String,
    phone: String,
    address: String,
  },
  area: String,
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  status: { type: String, default: 'pending' },
  scheduledFor: String,
  assignedTo: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner' },
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Order || model('Order', OrderSchema);
