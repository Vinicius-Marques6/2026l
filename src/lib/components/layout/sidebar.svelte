<script lang="ts">
    import { page } from '$app/state';
    import { House, History, Users, ChartColumn, Beer, Info } from '@lucide/svelte';
    import { cn } from '$lib/utils';
    import { Button } from '$lib/components/ui/button';
    
    const navigations = [
        { name: 'Adicionar', href: '/', icon: House },
        { name: 'Histórico', href: '/history', icon: History },
        { name: 'Estatísticas', href: '/stats', icon: ChartColumn },
        { name: 'Amigos', href: '/friends', icon: Users },
    ];
</script>

<aside class="hidden w-64 flex-col gap-2 border-r bg-card p-4 md:flex h-screen sticky top-0">
    <div class="flex items-center gap-2 px-4 py-6">
        <Beer class="h-8 w-8 text-primary" />
        <div class="flex flex-col">
            <span class="text-lg font-bold">2026L</span>
            <span class="text-xs text-muted-foreground">Vai tomando</span>
        </div>
    </div>

    <nav class="flex flex-1 flex-col gap-2">
        {#each navigations as nav}
            <a
                href={nav.href}
                class={cn(
                    "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    page.url.pathname === nav.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
            >
                <nav.icon class="h-5 w-5" />
                {nav.name}
            </a>
        {/each}
    </nav>

    {#if page.data.session?.user}
        <p>{page.data.session.user.email}</p>
        <Button href="/auth/logout" variant="outline" class="w-full mb-4">Logout</Button>
    {:else}
        <Button href="/auth/login">Login</Button>
    {/if}

    <!-- Font: https://cisa.org.br/sua-saude/informativos/artigo/item/48-definicao-de-dose-padrao -->
    <div class="mt-auto rounded-lg bg-primary/10 p-4">
        <h4 class="mb-1 text-sm font-semibold text-primary">Dose Padrão</h4>
        <p class="text-xs text-muted-foreground">1 dose = 10g álcool puro</p>
        <p class="text-xs text-muted-foreground">1 dose = 250ml com 5% de teor</p>
    </div>
</aside>
