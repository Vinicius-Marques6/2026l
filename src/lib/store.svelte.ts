// In-memory store using Svelte 5 Runes
import { SvelteDate } from "svelte/reactivity";

export type Friend = {
    id: string;
    name: string;
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

// Initial Data
const initialDrinks: DrinkType[] = [
    { id: "1", name: "Cerveja (Lata)", abv: 4.7, defaultVolume: 350 },
    { id: "2", name: "Cerveja (Garrafa)", abv: 5, defaultVolume: 250 },
    { id: "3", name: "Vinho", abv: 12, defaultVolume: 150 },
    { id: "4", name: "Shot (Vodka/Tequila)", abv: 40, defaultVolume: 50 },
    { id: "5", name: "Gin Tônica", abv: 8, defaultVolume: 250 }, // estimativa
];

function createStore() {
    let friends = $state<Friend[]>([]);
    let drinks = $state<DrinkType[]>(initialDrinks);
    let logs = $state<Log[]>([]);

    return {
        get friends() { return friends; },
        get drinks() { return drinks; },
        get logs() { return logs; },

        addFriend(name: string) {
            const id = crypto.randomUUID();
            friends.push({ id, name });
            return id;
        },

        addLog(friendId: string, drinkId: string, quantity: number, notes?: string) {
            const drink = drinks.find(d => d.id === drinkId);
            if (!drink) return; // Safely handle if drink is not found

            const id = crypto.randomUUID();
            const totalVolume = drink.defaultVolume * quantity;
            
            // Calculation: volume (ml) * (abv / 100) * 0.789 (density g/ml) / 10 (g per dose)
            const gramsOfAlcohol = totalVolume * (drink.abv / 100) * 0.789;
            const doses = parseFloat((gramsOfAlcohol / 10).toFixed(1)); // Using 10g per dose

            console.log(`Logging: Friend ${friendId}, Drink ${drink.name}, Quantity ${quantity}, Total Volume ${totalVolume}ml, Doses ${doses}`);
            
            logs.push({
                id,
                friendId,
                drinkName: drink.name,
                volume: totalVolume,
                quantity,
                abv: drink.abv,
                doses,
                timestamp: new Date(),
                notes
            });
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
                    name: friends.find(f => f.id === friendId)?.name ?? "Unknown",
                    totalDoses
                }))
                .sort((a, b) => b.totalDoses - a.totalDoses);
        }
    };
}

export const store = createStore();
