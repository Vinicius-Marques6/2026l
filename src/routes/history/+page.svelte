<script lang="ts">
    import { store } from '$lib/store.svelte';
    import * as Card from '$lib/components/ui/card';
    import { History, Clock, Droplets } from '@lucide/svelte';
    import { fade } from 'svelte/transition';

    // Reverse logs to show newest first
    let sortedLogs = $derived([...store.logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));

    function formatTime(date: Date) {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
</script>

<div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-tight">Histórico</h1>
        <p class="text-muted-foreground">O que o grupo já bebeu hoje</p>
    </div>

    {#if sortedLogs.length === 0}
        <Card.Root>
            <Card.Content class="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <History class="h-12 w-12 mb-4 opacity-20" />
                <p>Nenhum registro ainda.</p>
            </Card.Content>
        </Card.Root>
    {:else}
        <div class="grid gap-4">
            {#each sortedLogs as log (log.id)}
                <div class="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/10 transition-colors" transition:fade>
                     <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span class="text-xs font-bold text-primary">
                            {store.friends.find(f => f.id === log.friendId)?.name.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h4 class="font-semibold text-sm truncate">
                                {store.friends.find(f => f.id === log.friendId)?.name}
                            </h4>
                            <span class="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock class="h-3 w-3" /> {formatTime(log.timestamp)}
                            </span>
                        </div>
                        <p class="text-sm text-foreground/80 mt-1">
                            {log.drinkName} <span class="text-muted-foreground text-xs">({log.volume}ml • {log.abv}%)</span>
                        </p>
                        {#if log.notes}
                            <p class="text-xs text-muted-foreground mt-1 italic">"{log.notes}"</p>
                        {/if}
                    </div>

                    <div class="text-right">
                        <div class="flex items-center justify-end gap-1 text-primary font-bold">
                            <Droplets class="h-3 w-3" />
                            {log.doses.toFixed(1)}
                        </div>
                        <span class="text-[10px] text-muted-foreground">DOSES</span>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
