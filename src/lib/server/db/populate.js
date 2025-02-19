import { db } from './index.js';
import { products } from './schema.js';

const productData = [
{ name: "Termék 1", description: "Ez egy csodálatos termék.", price: 1500, imageUrl: "/public/images/product1.jpg"},
{ name: "Termék 2", description: "Ez egy varázslatos termék.", price: 2000, imageUrl: "/public/images/product2.jpg"},
{ name: "Termék 3", description: "A legmágikusabb termék.", price: 2500, imageUrl: "/public/images/product3.jpg"},
];

async function seedDatabase() {
    try {
      console.log("Adatok beszúrása...");
      await db.insert(products).values(productData);
      console.log("Adatok sikeresen beszúrva!");
    } catch (error) {
      console.error("Hiba történt az adatok beszúrása közben:", error);
    }
  }
  
  seedDatabase();
  