// models/Assignment.ts
import mongoose, { Schema, model, models } from 'mongoose';

const AssignmentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  partnerId: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String },
  reason: String,
});

export default models.Assignment || model('Assignment', AssignmentSchema);
