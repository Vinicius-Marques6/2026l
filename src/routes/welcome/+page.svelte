<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import { Globe, Beer, GlassWater } from '@lucide/svelte';

    const { data } = $props();

    function formatTime(date: Date) {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
</script>

<div class="flex flex-col min-h-[calc(100vh-4rem)]">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div class="relative">
            <div class="absolute -inset-1 rounded-full bg-primary/20 blur-xl"></div>
            <h1 class="relative text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-primary to-primary/50">
                2026L
            </h1>
        </div>
        <p class="text-xl md:text-2xl text-muted-foreground max-w-150 text-balance">
            É pra beber tudo isso de litro em 2026 🤪
        </p>
        
        <form action="/auth/login" method="POST">
             <Button type="submit" size="lg" class="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105">
                <Globe class="mr-2 h-5 w-5" /> Entrar com Google
            </Button>
        </form>
    </section>

    <!-- Recent Logs Section -->
    <section class="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
            <span class="bg-primary/10 p-2 rounded-lg text-primary">
                <Beer class="h-6 w-6" />
            </span>
            Últimos Goles
        </h2>

        {#if data.logs.length === 0}
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed">
                <GlassWater class="h-12 w-12 mb-4 opacity-50" />
                <p>Nenhum registro encontrado.</p>
            </div>
        {/if}

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {#each data.logs as log}
                <Card.Root class="group hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
                    <Card.Header class="flex flex-row items-center gap-4 pb-2">
                        <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <GlassWater class="h-5 w-5 text-primary" />
                        </div>
                        <div class="flex flex-col overflow-hidden">
                            <h3 class="font-semibold truncate text-lg leading-tight">{log.profile.name}</h3>
                            <span class="text-xs text-muted-foreground">
                                {formatTime(log.createdAt)}
                            </span>
                        </div>
                    </Card.Header>
                    <Card.Content>
                        <div class="flex items-end justify-between">
                            <div>
                                <p class="font-medium text-foreground/90">{log.drinkType.name}</p>
                                <p class="text-sm text-muted-foreground">{log.volume}ml</p>
                            </div>
                            <div class="text-right">
                                <span class="text-2xl font-bold text-primary">{log.calculatedDoses.toFixed(1)}</span>
                                <span class="text-xs font-medium text-muted-foreground block uppercase tracking-wider">Doses</span>
                            </div>
                        </div>
                        {#if log.notes}
                            <div class="mt-4 pt-4 border-t border-border/50">
                                <p class="text-sm text-muted-foreground italic line-clamp-2">"{log.notes}"</p>
                            </div>
                        {/if}
                    </Card.Content>
                </Card.Root>
            {/each}
        </div>
    </section>
</div>
