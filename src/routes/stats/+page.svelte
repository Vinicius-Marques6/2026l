<script lang="ts">
    import { store } from '$lib/store.svelte';
    import * as Card from '$lib/components/ui/card';
    import { BarChart3, Trophy, Medal } from '@lucide/svelte';

    let stats = $derived(store.getStats());
</script>

<div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-tight">Estatísticas</h1>
        <p class="text-muted-foreground">Quem é o rei do camarote?</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
        <!-- Ranking Card -->
        <Card.Root class="col-span-2">
            <Card.Header>
                <Card.Title class="flex items-center gap-2">
                    <Trophy class="h-5 w-5 text-yellow-500" /> Ranking
                </Card.Title>
                <Card.Description>Baseado em doses padrão (10g álcool).</Card.Description>
            </Card.Header>
            <Card.Content>
                {#if stats.length === 0}
                    <div class="text-center py-8 text-muted-foreground">
                        Sem dados.
                    </div>
                {:else}
                    <div class="space-y-4">
                        {#each stats as stat, index (stat.friendId)}
                            <div class="flex items-center gap-4">
                                <div class="shrink-0 w-8 text-center font-bold text-muted-foreground">
                                    #{index + 1}
                                </div>
                                <div class="flex-1 space-y-1">
                                    <div class="flex items-center justify-between">
                                        <span class="font-medium flex items-center gap-2">
                                            {stat.name}
                                            {#if index === 0}
                                                <Medal class="h-4 w-4 text-yellow-500" />
                                            {:else if index === 1}
                                                <Medal class="h-4 w-4 text-gray-400" />
                                            {:else if index === 2}
                                                <Medal class="h-4 w-4 text-amber-600" />
                                            {/if}
                                        </span>
                                        <span class="font-bold text-primary">{stat.totalDoses.toFixed(1)} doses</span>
                                    </div>
                                    <!-- Progress Bar -->
                                    <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                        <div 
                                            class="h-full bg-primary" 
                                            style="width: {stats[0].totalDoses > 0 ? (stat.totalDoses / stats[0].totalDoses) * 100 : 0}%"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </Card.Content>
        </Card.Root>
    </div>
</div>
