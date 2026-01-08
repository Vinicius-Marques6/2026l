<script lang="ts">
    import { page } from '$app/stores';
    import { Home, History, Users, BarChart3 } from '@lucide/svelte';
    import { cn } from '$lib/utils';
    
    const navigations = [
        { name: 'Adicionar', href: '/', icon: Home },
        { name: 'Histórico', href: '/history', icon: History },
        { name: 'Estatísticas', href: '/stats', icon: BarChart3 },
        { name: 'Amigos', href: '/friends', icon: Users },
    ];
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 border-t bg-card md:hidden">
    <div class="grid grid-cols-4 h-16">
        {#each navigations as nav}
            <a
                href={nav.href}
                class={cn(
                    "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors hover:bg-accent/50",
                    $page.url.pathname === nav.href ? "text-primary" : "text-muted-foreground"
                )}
            >
                <nav.icon class="h-5 w-5" />
                <span class="scale-90">{nav.name}</span>
            </a>
        {/each}
    </div>
</nav>
