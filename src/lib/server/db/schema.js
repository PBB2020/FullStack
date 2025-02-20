import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Termékek táblája
export const products = sqliteTable("products", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
    price: real("price").notNull(),
    imageUrl: text("image_url"),
});

// Kosár tábla
export const cart = sqliteTable("cart", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    productId: integer("product_id").notNull(),
    quantity: integer("quantity").notNull().default(1),
});

// Rendelések táblája
export const orders = sqliteTable("orders", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    totalAmount: real("total_amount").notNull(),
    createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Rendelés tételek táblája
export const orderItems = sqliteTable("order_items", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderId: integer("order_id").notNull(),
    productId: integer("product_id").notNull(),
    quantity: integer("quantity").notNull(),
    price: real("price").notNull(),
});



