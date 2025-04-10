// models/DeliveryPartner.ts
import mongoose, { Schema, model, models } from "mongoose";

const DeliveryPartnerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  status: { type: String, default: "active" },
  currentLoad: { type: Number, default: 0 },
  areas: [String],
  shift: {
    start: String,
    end: String,
  },
  metrics: {
    rating: { type: Number, default: 5 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
  },
});

export default models.DeliveryPartner || model("DeliveryPartner", DeliveryPartnerSchema);
