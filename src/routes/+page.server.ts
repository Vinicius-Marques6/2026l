import { db } from "$lib/db";
import { drinkTable, logTable } from "$lib/db/schema";
import { redirect } from "@sveltejs/kit";
import { desc } from "drizzle-orm";

export const load = async ({ locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
        redirect(303, '/welcome');
    }

    const profiles = await db.query.profileTable.findMany();
    const drinks = await db.query.drinkTable.findMany();
    const logs = await db.query.logTable.findMany({
        orderBy: [desc(logTable.createdAt)],
        with: {
            profile: true,
            drinkType: true,
        }
    });
    
    return { 
        profiles,
        drinks,
        logs,
        user
    };
}

export const actions = {
    logDrink: async ({ request }) => {
        const formData = await request.formData();
        let profileId = formData.get("profileId")?.toString();
        let drinkTypeId = formData.get("drinkTypeId")?.toString();
        const quantity = Number(formData.get("quantity"));
        const notes = formData.get("notes")?.toString() || "";

        if (!profileId || !drinkTypeId || !quantity) {
             return { success: false, error: "Missing required fields" };
        }

        const drink = await db.query.drinkTable.findFirst({
            where: (dt, { eq }) => eq(dt.id, Number(drinkTypeId))
        });

        if (!drink) return { success: false, error: "Drink not found" };

        const totalVolume = drink.defaultVolume * quantity;
        const gramsOfAlcohol = totalVolume * (drink.alcoholContent / 100) * 0.789;
        const doses = parseFloat((gramsOfAlcohol / 10).toFixed(1));

        await db.insert(logTable).values({
            profileId: Number(profileId),
            drinkTypeId: Number(drinkTypeId),
            quantity,
            volume: drink.defaultVolume,
            calculatedDoses: doses,
            notes,
        });

        return { success: true };
    },
}