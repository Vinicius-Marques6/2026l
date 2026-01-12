import { db } from "$lib/db";
import { profileTable } from "$lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const getUserProfile = async (locals: App.Locals) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
        return null;
    }

    const curProfile = await db.query.profileTable.findFirst({
        where: eq(profileTable.userId, user.id),
    });

    if (curProfile) {
        return curProfile;
    }

    return null;
}

export const getOrLinkUserProfile = async (locals: App.Locals) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
        return null;
    }

    const curProfile = await db.query.profileTable.findFirst({
        columns: { userId: true },
        where: eq(profileTable.userId, user.id),
    });

    if (curProfile) {
        return curProfile;
    }

    const linkProfile = await db.update(profileTable)
        .set({
            userId: user.id,
            name: user.user_metadata?.name || user.email,
            avatarUrl: user.user_metadata?.avatar_url,
        }).where(and(
            eq(profileTable.email, user.email!),
            isNull(profileTable.userId)
        )).returning({ userId: profileTable.userId });

    if (linkProfile.length === 0) {
        return null;
    }

    return linkProfile[0];
}   