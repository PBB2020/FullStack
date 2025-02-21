import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { cart, products } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "$lib/server/auth";

const TEST_MODE = true;

async function getUserId(locals) {
    if (TEST_MODE) return 1;
    const session = await locals.auth.validate();
    return session?.user.userId || null;
}

export async function GET({locals}) {
    const userId = await getUserId(locals);
    if (!userId) return json({ error: "Nem hitelesített." }, { status: 401 });

    const cartItems = await db.select({
        id: cart.id,
        productId: cart.productId,
        quantity: cart.quantity,
        name: products.name,
        price: products.price,
        imageUrl: products.imageUrl
    })
    .from(cart)
    .leftJoin(products, eq(cart.productId, products.id))
    .where(eq(cart.userId, userId));

    return json(cartItems);
}

export async function POST({ request, locals }) {
    const userId = await getUserId(locals);
    if (!userId) return json({ error: "Nem hitelesített." }, { status: 401 });

    const { productId, quantity } = await request.json();
    if (!productId || quantity <= 0) {
        return json({ error: "Érvénytelen termék vagy mennyiség." }, { status: 400 });
    }

    // Ellenőrizzük, hogy van-e már ilyen termék a kosárban
    const existingItem = await db.select().from(cart)
        .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
        .limit(1);

    if (existingItem.length > 0) {
        // Ha már létezik, növeljük a mennyiséget
        await db.update(cart).set({ quantity: existingItem[0].quantity + quantity })
            .where(eq(cart.id, existingItem[0].id));
    } else {
        // Ha nem létezik, új bejegyzést hozunk létre
        await db.insert(cart).values({ userId, productId, quantity });
    }

    return json({ message: "Kosár frissítve." });
}

export async function DELETE({ request, locals }) {
    const userId = await getUserId(locals); 
    if (!userId) return json({ error: "Nem hitelesített." }, { status: 401 });

    const { productId } = await request.json();
    if (!productId) {
        return json({ error: "A termék azonosító megadása kötelező." }, { status: 400 });
    }

    await db.delete(cart).where(and(eq(cart.userId, userId), eq(cart.productId, productId)));
    return json({ message: "A termék kikerült a kosárból." });
}
