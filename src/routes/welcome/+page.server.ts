
import { db } from "$lib/db";
import { logTable } from "$lib/db/schema";
import { redirect } from "@sveltejs/kit";
import { desc } from "drizzle-orm";

export const load = async ({ locals }) => {

    const { user } = await locals.safeGetSession();

    if (user) {
        redirect(303, '/');
    }

    const logs = await db.query.logTable.findMany({
        orderBy: [desc(logTable.createdAt)],
        limit: 10,
        with: {
            profile: true,
            drinkType: true,
        }
    });
    
    return { 
        logs,
    };
}
