import dotenv from "dotenv";
import mongoose from "mongoose";
import Menu from "./models/Menu.js";

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is undefined! Check your .env file");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🌿 MongoDB Connected for Seeding"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const seedMenu = async () => {
  try {
    console.log("🧹 Clearing existing menu...");
    await Menu.deleteMany();

    console.log("🌱 Inserting new menu...");
    const items = await Menu.insertMany([
      {
        name: "Espresso",
        category: "Hot",
        price: 450,
        inStock: true,
        description: "A strong and bold shot of pure coffee energy.",
        image:
          "https://www.groundstobrew.com/wp-content/uploads/2021/06/best-starbucks-iced-coffee-drinks.jpg", // works in RN
      },
      {
        name: "Cold Brew",
        category: "Cold",
        price: 550,
        inStock: false,
        description:
          "Smooth, refreshing, and steeped overnight for flavor perfection.",
        image:
          "https://www.qsrmagazine.com/wp-content/uploads/2023/08/RFSEPT23_GloriaJeansCoffees_2.jpg",
      },
      {
        name: "Latte",
        category: "Hot",
        price: 500,
        inStock: true,
        description: "Velvety steamed milk balanced with rich espresso.",
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      },
      {
        name: "Cappuccino",
        category: "Hot",
        price: 480,
        inStock: true,
        description:
          "Frothy milk foam layered over rich espresso for a creamy delight.",
        image:
          "https://velvetandvinegar.com/wp-content/uploads/2019/06/Cold-Brewed-Coffee-Latte-2-1-von-1.jpg",
      },
    ]);

    console.log(`✅ ${items.length} menu items seeded successfully!`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

seedMenu();
