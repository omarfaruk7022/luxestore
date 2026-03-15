import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

dotenv.config({ path: ".env.local" });

const UNSPLASH_SHIRTS = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
  "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800",
  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800",
  "https://images.unsplash.com/photo-1581791538126-36a43cdfd49a?w=800",
];
const UNSPLASH_PANTS = [
  "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800",
  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
  "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
];

const categories = [
  {
    name: "Classic Briefs",
    slug: "classic-briefs",
    description: "Everyday comfort essentials",
    sortOrder: 1,
  },
  {
    name: "Boxer Collection",
    slug: "boxer-collection",
    description: "Relaxed fit for all-day wear",
    sortOrder: 2,
  },
  {
    name: "Premium Undershirts",
    slug: "premium-undershirts",
    description: "Soft inner layer collection",
    sortOrder: 3,
  },
  {
    name: "Loungewear",
    slug: "loungewear",
    description: "Comfortable home & leisure wear",
    sortOrder: 4,
  },
  {
    name: "Athletic Wear",
    slug: "athletic-wear",
    description: "High-performance active base layers",
    sortOrder: 5,
  },
  {
    name: "Thermal Collection",
    slug: "thermal-collection",
    description: "Warm & cozy inner layers",
    sortOrder: 6,
  },
];

const makeVariants = (colors) => {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  return sizes.flatMap((size) =>
    colors.map((c) => ({
      size,
      color: c.name,
      colorHex: c.hex,
      stock: Math.floor(Math.random() * 50) + 5,
    })),
  );
};

const colorSets = {
  neutral: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#000000" },
    { name: "Gray", hex: "#808080" },
  ],
  warm: [
    { name: "Navy", hex: "#001F5B" },
    { name: "Burgundy", hex: "#800020" },
    { name: "Olive", hex: "#808000" },
  ],
  cool: [
    { name: "Sky Blue", hex: "#87CEEB" },
    { name: "Mint", hex: "#98FF98" },
    { name: "Lavender", hex: "#E6E6FA" },
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔌 Connected to MongoDB");

  // Cleanup
  await Promise.all([
    // User.deleteMany(),
    Category.deleteMany(),
    Product.deleteMany(),
  ]);
  console.log("🗑️  Cleared existing data");

  // Users
  const adminPass = await bcrypt.hash("admin123", 12);
  const userPass = await bcrypt.hash("user1234", 12);
  // await User.create([
  //   {
  //     name: "Admin User",
  //     email: "admin@luxestore.com",
  //     password: adminPass,
  //     role: "admin",
  //   },
  //   {
  //     name: "Jane Doe",
  //     email: "jane@example.com",
  //     password: userPass,
  //     role: "user",
  //   },
  //   {
  //     name: "Omar Hassan",
  //     email: "omar@example.com",
  //     password: userPass,
  //     role: "user",
  //   },
  // ]);
  console.log("👥 Users seeded");

  // Categories
  const cats = await Category.insertMany(categories);
  console.log("📂 Categories seeded");
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c._id]));

  // Products
  const products = [
    {
      name: "Essential Comfort Brief",
      slug: "essential-comfort-brief",
      category: catMap["classic-briefs"],
      price: 450,
      discountPrice: 380,
      images: [UNSPLASH_SHIRTS[0], UNSPLASH_SHIRTS[1]],
      variants: makeVariants(colorSets.neutral),
      isFeatured: true,
      isBestSeller: true,
      material: "95% Cotton, 5% Elastane",
      description:
        "The ultimate everyday brief. Crafted from premium Egyptian cotton blend for a soft, breathable fit that moves with you all day long. Perfect as a base layer under any outfit.",
      shortDescription: "Premium Egyptian cotton everyday brief",
      tags: ["cotton", "everyday", "comfort"],
    },
    {
      name: "Sport Flex Brief",
      slug: "sport-flex-brief",
      category: catMap["athletic-wear"],
      price: 650,
      discountPrice: 520,
      images: [UNSPLASH_SHIRTS[2], UNSPLASH_SHIRTS[3]],
      variants: makeVariants(colorSets.neutral),
      isFeatured: true,
      isNewArrival: true,
      material: "88% Polyester, 12% Spandex",
      description:
        "Engineered for peak performance. The Sport Flex Brief features moisture-wicking technology and a contoured pouch design for unrestricted movement during any athletic activity.",
      shortDescription: "Performance moisture-wicking athletic brief",
      tags: ["sport", "performance", "moisture-wicking"],
    },
    {
      name: "Classic Relaxed Boxer",
      slug: "classic-relaxed-boxer",
      category: catMap["boxer-collection"],
      price: 550,
      discountPrice: null,
      images: [UNSPLASH_PANTS[0], UNSPLASH_PANTS[1]],
      variants: makeVariants(colorSets.warm),
      isFeatured: true,
      isBestSeller: true,
      material: "100% Combed Cotton",
      description:
        "A timeless boxer with a relaxed fit for maximum comfort. Made from pure combed cotton with a reinforced waistband that maintains its shape wash after wash.",
      shortDescription: "Pure combed cotton relaxed boxer",
      tags: ["boxer", "relaxed", "cotton"],
    },
    {
      name: "Modal Luxury Boxer Brief",
      slug: "modal-luxury-boxer-brief",
      category: catMap["boxer-collection"],
      price: 850,
      discountPrice: 720,
      images: [UNSPLASH_PANTS[2], UNSPLASH_PANTS[3]],
      variants: makeVariants(colorSets.cool),
      isFeatured: true,
      isNewArrival: true,
      material: "92% Modal, 8% Elastane",
      description:
        "Experience the silky softness of modal fabric in this premium boxer brief. Naturally breathable and temperature-regulating, modal keeps you cool in summer and warm in winter.",
      shortDescription: "Silky modal fabric luxury boxer brief",
      tags: ["modal", "luxury", "premium"],
    },
    {
      name: "V-Neck Undershirt Classic",
      slug: "v-neck-undershirt-classic",
      category: catMap["premium-undershirts"],
      price: 480,
      discountPrice: 400,
      images: [UNSPLASH_SHIRTS[4], UNSPLASH_SHIRTS[5]],
      variants: makeVariants(colorSets.neutral),
      isFeatured: false,
      isBestSeller: true,
      material: "100% Supima Cotton",
      description:
        "The go-to undershirt for any occasion. Deep V-neck design stays invisible under dress shirts while Supima cotton delivers unmatched softness and durability.",
      shortDescription: "Invisible Supima cotton V-neck undershirt",
      tags: ["undershirt", "v-neck", "supima"],
    },
    {
      name: "Crew Neck Undershirt Pack",
      slug: "crew-neck-undershirt-pack",
      category: catMap["premium-undershirts"],
      price: 1200,
      discountPrice: 990,
      images: [UNSPLASH_SHIRTS[0], UNSPLASH_SHIRTS[2]],
      variants: makeVariants(colorSets.neutral),
      isBestSeller: true,
      material: "95% Pima Cotton, 5% Spandex",
      description:
        "Value pack of 3 premium crew neck undershirts. Each piece features our signature StayFresh technology that neutralizes odor and keeps you feeling fresh throughout the day.",
      shortDescription: "Pack of 3 StayFresh crew neck undershirts",
      tags: ["crew-neck", "pack", "odor-control"],
    },
    {
      name: "Lounge Jogger Pants",
      slug: "lounge-jogger-pants",
      category: catMap["loungewear"],
      price: 1400,
      discountPrice: 1150,
      images: [UNSPLASH_PANTS[4], UNSPLASH_PANTS[0]],
      variants: makeVariants(colorSets.warm),
      isFeatured: true,
      isNewArrival: true,
      material: "60% Cotton, 40% Polyester",
      description:
        "Ultimate comfort meets casual style in these lounge jogger pants. Elastic waistband with drawstring, tapered fit, and side pockets make these perfect for home or a casual day out.",
      shortDescription: "Comfort-first elastic waist lounge joggers",
      tags: ["lounge", "jogger", "casual"],
    },
    {
      name: "Thermal Long Johns Set",
      slug: "thermal-long-johns-set",
      category: catMap["thermal-collection"],
      price: 1800,
      discountPrice: 1500,
      images: [UNSPLASH_SHIRTS[3], UNSPLASH_PANTS[2]],
      variants: makeVariants(colorSets.neutral),
      isNewArrival: true,
      material: "80% Merino Wool, 20% Nylon",
      description:
        "Stay warm without the bulk. This merino wool thermal set provides exceptional insulation while remaining lightweight and breathable. Anti-itch treatment makes it comfortable against bare skin.",
      shortDescription: "Merino wool anti-itch thermal base layer set",
      tags: ["thermal", "merino", "winter"],
    },
    {
      name: "Athletic Compression Shorts",
      slug: "athletic-compression-shorts",
      category: catMap["athletic-wear"],
      price: 750,
      discountPrice: 620,
      images: [UNSPLASH_PANTS[3], UNSPLASH_PANTS[1]],
      variants: makeVariants(colorSets.neutral),
      isFeatured: true,
      isBestSeller: true,
      material: "80% Nylon, 20% Spandex",
      description:
        "High-performance compression shorts designed for serious athletes. Graduated compression technology improves circulation and reduces muscle fatigue during intense workouts.",
      shortDescription: "Graduated compression athletic shorts",
      tags: ["compression", "athletic", "performance"],
    },
    {
      name: "Bamboo Soft Brief",
      slug: "bamboo-soft-brief",
      category: catMap["classic-briefs"],
      price: 580,
      discountPrice: 480,
      images: [UNSPLASH_SHIRTS[1], UNSPLASH_SHIRTS[4]],
      variants: makeVariants(colorSets.cool),
      isNewArrival: true,
      material: "95% Bamboo Viscose, 5% Elastane",
      description:
        "The future of intimate wear. Made from sustainably sourced bamboo viscose, these briefs are naturally hypoallergenic, antibacterial, and incredibly soft on sensitive skin.",
      shortDescription: "Eco-friendly bamboo viscose everyday brief",
      tags: ["bamboo", "eco", "hypoallergenic"],
    },
    {
      name: "Relaxed Lounge Shorts",
      slug: "relaxed-lounge-shorts",
      category: catMap["loungewear"],
      price: 900,
      discountPrice: 750,
      images: [UNSPLASH_PANTS[4], UNSPLASH_PANTS[3]],
      variants: makeVariants(colorSets.warm),
      isFeatured: false,
      material: "100% Cotton Terry",
      description:
        "Unwind in style with these ultra-soft terry cotton lounge shorts. Relaxed fit with elasticated waist and drawstring, ideal for lounging at home or quick errands.",
      shortDescription: "Ultra-soft terry cotton lounge shorts",
      tags: ["lounge", "shorts", "relaxed"],
    },
    {
      name: "Performance Singlet Top",
      slug: "performance-singlet-top",
      category: catMap["athletic-wear"],
      price: 680,
      discountPrice: null,
      images: [UNSPLASH_SHIRTS[5], UNSPLASH_SHIRTS[2]],
      variants: makeVariants(colorSets.neutral),
      isNewArrival: true,
      material: "92% Polyester, 8% Elastane",
      description:
        "Lightweight singlet designed for maximum performance. Racerback design allows full range of motion, while our DryFit technology keeps sweat away from your skin during the most intense sessions.",
      shortDescription: "DryFit racerback performance singlet",
      tags: ["singlet", "athletic", "dryfit"],
    },
  ];

  await Product.create(products);
  console.log("📦 Products seeded");

  console.log("\n✅ Seed complete!");
  console.log("   Admin → admin@luxestore.com / admin123");
  console.log("   User  → jane@example.com / user1234");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
