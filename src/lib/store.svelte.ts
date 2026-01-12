export type Friend = {
    id: string;
    name: string;
    avatarUrl?: string;
};

export type DrinkType = {
    id: string;
    name: string;
    abv: number; // percentage, e.g. 5 for 5%
    defaultVolume: number; // ml
};

export type Log = {
    id: string;
    friendId: string;
    drinkName: string;
    volume: number;
    quantity: number;
    abv: number;
    doses: number;
    timestamp: Date;
    notes?: string;
};

function createStore() {
    let friends = $state<Friend[]>([]);
    let drinks = $state<DrinkType[]>([]);
    let logs = $state<Log[]>([]);

    return {
        get friends() { return friends; },
        get drinks() { return drinks; },
        get logs() { return logs; },

        sync(data: any) {
            friends = data.profiles.map((p: any) => ({ id: p.id, name: p.name, avatarUrl: p.avatarUrl }));
            drinks = data.drinks.map((d: any) => ({ id: d.id, name: d.name, abv: d.alcoholContent, defaultVolume: d.defaultVolume }));
            logs = data.logs.map((l: any) => ({
                id: l.id,
                friendId: l.profileId,
                drinkName: l.drinkType?.name || 'Unknown',
                volume: l.volume,
                quantity: l.quantity,
                abv: l.drinkType?.alcoholContent || 0,
                doses: l.calculatedDoses,
                timestamp: new Date(l.createdAt),
                notes: l.notes
            }));
        },

        getStats() {
            // Compute total doses per friend
            const stats: Record<string, number> = {};
            for (const f of friends) {
                stats[f.id] = 0;
            }
            for (const l of logs) {
                if (stats[l.friendId] !== undefined) {
                    stats[l.friendId] += l.doses;
                }
            }

            return Object.entries(stats)
                .map(([friendId, totalDoses]) => ({
                    friendId,
                    name: friends.find(f => f.id == friendId)?.name ?? "Unknown",
                    totalDoses
                }))
                .sort((a, b) => b.totalDoses - a.totalDoses);
        }
    };
}

export const store = createStore();
