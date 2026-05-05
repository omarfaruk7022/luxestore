import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    // One settings doc per store (singleton)
    storeName: { type: String, default: 'My Store' },
    tagline: { type: String, default: 'Quality products for everyone' },
    logo: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: 'Dhaka, Bangladesh' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },

    // Active template/design
    activeTemplate: {
      type: String,
      enum: ['luxe', 'minimal', 'bold', 'nature'],
      default: 'luxe',
    },

    // Custom color overrides (empty = use template defaults)
    colors: {
      primary: { type: String, default: '' },
      secondary: { type: String, default: '' },
      accent: { type: String, default: '' },
      background: { type: String, default: '' },
      foreground: { type: String, default: '' },
      muted: { type: String, default: '' },
      border: { type: String, default: '' },
    },

    // Store config
    currency: { type: String, default: 'BDT' },
    currencySymbol: { type: String, default: '৳' },
    freeShippingThreshold: { type: Number, default: 999 },

    // SEO
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
