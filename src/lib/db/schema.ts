import { pgTable, text, uuid, integer, real, timestamp, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const profileTable = pgTable("profile", {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").unique(),
    name: text("name"),
    email: text("email").notNull().unique(),
    avatarUrl: text("avatar_url"),
})

export const drinkTable = pgTable("drink_types", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    alcoholContent: real("alcohol_content").notNull(),
    defaultVolume: integer("default_volume").notNull(),
})

export const logTable = pgTable("logs", {
    id: serial("id").primaryKey(),
    profileId: integer("profile_id").references(() => profileTable.id).notNull(),
    drinkTypeId: integer("drink_type_id").references(() => drinkTable.id).notNull(),
    notes: text("notes"),
    quantity: real("quantity").notNull(), // Number of "drinks" (e.g. 2 beers)
    volume: integer("volume").notNull(), // Total volume in ml
    calculatedDoses: real("calculated_doses").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const logRelations = relations(logTable, ({ one }) => ({
    profile: one(profileTable, {
        fields: [logTable.profileId],
        references: [profileTable.id],
    }),
    drinkType: one(drinkTable, {
        fields: [logTable.drinkTypeId],
        references: [drinkTable.id],
    }),
}));

export const profileRelations = relations(profileTable, ({ many }) => ({
    logs: many(logTable),
}));

export const drinkRelations = relations(drinkTable, ({ many }) => ({
    logs: many(logTable),
}));
