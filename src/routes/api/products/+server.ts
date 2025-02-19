import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { products } from "$lib/server/db/schema";

export async function GET() {
    const allProducts = db.select().from(products).all();
    return json(allProducts);
}