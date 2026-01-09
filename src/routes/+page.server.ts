import { db } from "$lib/db";

export const load = async ({ locals }) => {
    const profiles = await db.query.profileTable.findMany();
    const user = await locals.safeGetSession();
    return { profiles, user };
}