import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId },
  size: { type: String, required: true },
  color: { type: String, required: true },
  colorHex: { type: String, default: '#000000' },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
  name: { type: String },
  image: { type: String },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    coupon: { type: String, default: null },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

cartSchema.virtual('total').get(function () {
  return this.subtotal - this.discount;
});

cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
