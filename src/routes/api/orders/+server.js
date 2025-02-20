import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { orders, orderItems, cart, products } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST({ locals }) {
    const userId = locals.user?.id;
    if (!userId) return json({ error: "Nem hitelesített." }, { status: 401 });

    const cartItems = await db.select().from(cart).where(eq(cart.userId, userId));
    if (cartItems.length === 0) return json({ error: "A kosár üres." }, { status: 400 });

    let totalAmount = 0;
    const orderData = cartItems.map(item => {
        totalAmount += item.quantity * item.price;
        return {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        };
    });

    // Létrehozzuk a rendelést
    const [newOrder] = await db.insert(orders).values({
        userId,
        totalAmount
    }).returning();

    // Rendelés tételek beszúrása
    await db.insert(orderItems).values(
        orderData.map(item => ({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }))
    );

    // Kosár ürítése
    await db.delete(cart).where(eq(cart.userId, userId));

    return json({ message: "Rendelés sikeresen leadva.", orderId: newOrder.id });
}