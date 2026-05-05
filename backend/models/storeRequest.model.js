import mongoose from 'mongoose';

const storeRequestSchema = new mongoose.Schema(
  {
    // Client info
    storeName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    businessType: { type: String, default: '' }, // e.g. "Fashion", "Electronics"
    message: { type: String, default: '' },

    // Status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // After approval
    dbName: { type: String, default: '' },         // auto-generated on approval
    adminEmail: { type: String, default: '' },
    adminPassword: { type: String, default: '' },  // temp password, shown once
    approvedAt: { type: Date },
    rejectedReason: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.models.StoreRequest ||
  mongoose.model('StoreRequest', storeRequestSchema);
