import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { orders, orderItems, cart, products } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

const TEST_MODE = true;

async function getUserId(locals) {
    if (TEST_MODE) return 1;
    const session = await locals.auth.validate();
    return session?.user.userId || null;
}

export async function POST({ locals }) {
    const userId = await getUserId(locals);
    if (!userId) return json({ error: "Nem hitelesített." }, { status: 401 });

     // Lekérjük a kosár tartalmát
    const cartItems = await db.select().from(cart).where(eq(cart.userId, userId));
    if (cartItems.length === 0) return json({ error: "A kosár üres." }, { status: 400 });

    // Rendelés létrehozása
    const orderId = await db.insert(orders).values({ userId }).returning({ id: orders.id });

    // Rendelés tételeinek mentése
    const orderItemsData = cartItems.map(item => ({
        orderId: orderId[0].id,
        productId: item.productId,
        quantity: item.quantity
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Kosár ürítése
    await db.delete(cart).where(eq(cart.userId, userId));

    return json({ message: "Rendelés sikeresen leadva.", orderId: orderId[0].id });
}