<script lang="ts">
    import { store } from '$lib/store.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import * as Select from '$lib/components/ui/select';
    import * as Card from '$lib/components/ui/card';
    import { Plus, Beer, Minus } from '@lucide/svelte';
    import { enhance } from '$app/forms';

    const { data } = $props();


    $effect(() => {
        store.sync(data);
    });

    // Log Form State
    let selectedFriendId = $state("");
    let selectedDrinkId = $state("");
    let quantity = $state(1);
    let notes = $state("");

    let topDrinker = $derived(store.getStats()[0]);

    let selectedDrink = $derived(store.drinks.find(d => d.id === selectedDrinkId));
    let totalVolume = $derived.by(() => {
        if (!selectedDrink || !quantity) return 0;
        return selectedDrink.defaultVolume * quantity;
    });
    let estimatedDoses = $derived.by(() => {
        if (!selectedDrink || !quantity) return 0;
        const totalVolume = selectedDrink.defaultVolume * quantity;
        const gramsOfAlcohol = totalVolume * (selectedDrink.abv / 100) * 0.789;
        return gramsOfAlcohol / 10;
    });

    function roundQuantity(value: number): number {
        return Math.round(value * 10) / 10;
    }
</script>

<div class="flex flex-col gap-6">
    <div class="flex flex-row justify-between items-center">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold tracking-tight">2026L</h1>
            <p class="text-muted-foreground">Rastreador de consumo</p>
        </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <!-- Main Form Card -->
        <Card.Root class="col-span-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <Card.Header>
                <Card.Title class="flex items-center gap-2">
                    Registrar Bebida
                </Card.Title>
                <Card.Description>
                    Selecione quem bebeu e o quê.
                </Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
                <form method="POST" action="?/logDrink" use:enhance class="space-y-4"
                    onsubmit={() => {
                        // Reset optional fields if needed, main fields stay for rapid entry usually
                    }}
                >
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div class="space-y-2">
                            <Label for="friend">Quem bebeu? *</Label>
                            <input type="hidden" name="profileId" value={selectedFriendId} />
                            <Select.Root type="single" bind:value={selectedFriendId} disabled={store.friends.length === 0}>
                                <Select.Trigger id="friend" class="w-full">
                                    {selectedFriendId ? store.friends.find(f => f.id === selectedFriendId)?.name : 'Selecione um amigo'}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each store.friends as friend}
                                        <Select.Item value={friend.id}>{friend.name}</Select.Item>
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                            {#if store.friends.length === 0}
                                <p class="text-[0.8rem] text-muted-foreground">Nenhum amigo cadastrado.</p>
                            {/if}
                        </div>

                        <div class="space-y-2">
                            <Label for="drink">Tipo de bebida *</Label>
                            <input type="hidden" name="drinkTypeId" value={selectedDrinkId} />
                            <Select.Root type="single" bind:value={selectedDrinkId} disabled={store.drinks.length === 0}>
                                <Select.Trigger id="drink" class="w-full">
                                    {selectedDrinkId ? store.drinks.find(d => d.id === selectedDrinkId)?.name : 'Selecione um tipo de bebida'}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each store.drinks as drink}
                                        <Select.Item value={drink.id}>{drink.name}</Select.Item>
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        </div>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        <div class="space-y-2">
                            <Label for="quantity">
                                Quantidade
                                {#if selectedDrink}
                                    <span class="text-muted-foreground font-normal">({totalVolume}ml)</span>
                                {/if}
                            </Label>
                            <div class="flex gap-2">
                                <Button type="button" variant="destructive" size="icon" onclick={() => quantity = roundQuantity(Math.max(0.1, quantity - 0.1))}><Minus /></Button>
                                <Input type="number" name="quantity" id="quantity" class="text-center" bind:value={quantity} min="0.1" step="0.1" oninput={() => quantity = roundQuantity(quantity)} />
                                <Button type="button" variant="default" size="icon" onclick={() => quantity = roundQuantity(quantity + 0.1)}><Plus /></Button>
                            </div>
                        </div>
                            <div class="space-y-2">
                            <Label for="notes">Observações</Label>
                            <Input type="text" name="notes" id="notes" bind:value={notes} placeholder="Ex: Heineken, Vinho Tinto..." />
                        </div>
                    </div>

                    {#if estimatedDoses > 0}
                        <div class="mt-2 rounded-md bg-green-500/10 p-3 text-sm font-medium text-green-500 border border-green-500/20">
                            ≈ {estimatedDoses.toFixed(1)} dose(s) padrão
                        </div>
                    {/if}

                    <Button 
                        type="submit"
                        class="w-full bg-primary text-white hover:bg-primary/90 font-bold mt-2" 
                        size="lg"
                        disabled={!selectedFriendId || !selectedDrinkId}
                    >
                        <Plus class="mr-2 h-4 w-4" /> Registrar Bebida
                    </Button>
                </form>
            </Card.Content>
        </Card.Root>

        <!-- Stats / Info Card -->
        <Card.Root class="flex flex-col justify-between bg-linear-to-br from-card to-primary/5 border-none">
            <Card.Header>
                <Card.Title>Destaque da Noite</Card.Title>
                <Card.Description>Quem está bebendo mais?</Card.Description>
            </Card.Header>
            <Card.Content class="flex-1 flex flex-col items-center justify-center p-6 text-center">
                {#if topDrinker}
                    <div class="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse">
                        <Beer class="h-10 w-10 text-primary" />
                    </div>
                    <h3 class="text-2xl font-bold">{topDrinker.name}</h3>
                    <p class="text-4xl font-extrabold text-primary mt-2">
                        {topDrinker.totalDoses.toFixed(1)} <span class="text-sm font-normal text-muted-foreground">doses</span>
                    </p>
                {:else}
                    <div class="text-muted-foreground">Nenhum dado ainda. Comece a beber!</div>
                {/if}
            </Card.Content>
        </Card.Root>
    </div>
</div>
