import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  colorHex: { type: String, default: "#000000" },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String },
});

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    images: [{ type: String }],
    variants: [variantSchema],
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    totalStock: { type: Number, default: 0 },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    material: { type: String, default: "" },
    careInstructions: { type: String, default: "" },
    brand: { type: String, default: "LuxeWear" },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Calculate total stock before saving
productSchema.pre("save", function (next) {
  this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
  if (this.reviews.length > 0) {
    this.rating =
      this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});
productSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
