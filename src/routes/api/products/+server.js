import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { products } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const allProducts = await db.select().from(products);
        return json(allProducts);
    } catch (error) {
        return json({ error: "Probléma adódott a termékek lekérdezése közben." }, { status: 500 });
    }
}


export async function POST() {
    try {
        const { name, description, price, imageUrl } = await request.json();
        if(!name || !price) {
            return json({ error: "A termék nevének és árának kitöltése kötelező."}, {status: 400 });
        }

        const inserted = await db.insert(products).values({name, description, price, imageUrl }).returning();
        return json(inserted[0], {status: 201});
    } catch (error){
        return json({ error: "Probléma adódott a termék hozzáadása közben."}, {status: 500});
    }
}

export async function PUT({ request }) {
    try {
        const { id, name, description, price, imageUrl } = await request.json();
        if (!id || !name || !price) {
            return json({ error: "Az azonosító, név és ár kötelező" }, { status: 400 });
        }

        const updated = await db.update(products).set({ name, description, price, imageUrl }).where(eq(products.id, id)).returning();
        return json(updated[0] ?? { error: "Termék nem található." }, { status: updated.length ? 200 : 404 });
    } catch (error) {
        return json({ error: "Hiba a termék frissítése során." }, { status: 500 });
    }
}

export async function DELETE({ request }) {
    try {
        const { id } = await request.json();
        if (!id) {
            return json({ error: "Termék azonosító kötelező." }, { status: 400 });
        }

        await db.delete(products).where(eq(products.id, id));
        return json({ message: "A termék törölve." }, { status: 200 });
    } catch (error) {
        return json({ error: "Probléma a termék törlése során." }, { status: 500 });
    }
}