<script lang="ts">
    import { store } from '$lib/store.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import * as Card from '$lib/components/ui/card';
    import { UserPlus, Users } from '@lucide/svelte';
    import { page } from '$app/state';

    let newFriendName = $state("");
</script>

<div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-tight">Amigos</h1>
        <p class="text-muted-foreground">Gerencie quem está no rolê</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
        <!-- Add Friend Form -->
        <!-- <Card.Root class="border-primary/20 bg-card/50 backdrop-blur-sm h-fit">
            <Card.Header>
                <Card.Title class="flex items-center gap-2">
                    <UserPlus class="h-4 w-4 text-primary" /> Adicionar Amigo
                </Card.Title>
                <Card.Description>Cadastre novos integrantes para o grupo.</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
                <div class="space-y-2">
                    <Label for="name">Nome</Label>
                    <Input id="name" placeholder="Ex: João, Maria..." bind:value={newFriendName} />
                </div>
                <Button 
                    class="w-full bg-primary text-white font-bold"
                    disabled
                >
                    Adicionar
                </Button>
            </Card.Content>
        </Card.Root> -->

        <!-- Friends List -->
        <Card.Root>
            <Card.Header>
                <Card.Title class="flex items-center gap-2">
                    <Users class="h-4 w-4" /> Lista de Amigos
                </Card.Title>
                <Card.Description>Total: {store.friends.length}</Card.Description>
            </Card.Header>
            <Card.Content>
                {#if store.friends.length === 0}
                    <div class="text-center py-8 text-muted-foreground">
                        Nenhum amigo cadastrado.
                    </div>
                {:else}
                    <div class="flex flex-col gap-2">
                        {#each store.friends as friend (friend.id)}
                            <div class="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-accent transition-colors">
                                <div class="flex items-center gap-3">
                                    <div class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                        {friend.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span class="font-medium">{friend.name}</span>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </Card.Content>
        </Card.Root>
    </div>

    {#if page.data.session?.user}
        <Button href="/auth/logout" variant="outline" class="w-full mb-4">Logout</Button>
    {:else}
        <Button href="/auth/login">Login</Button>
    {/if}
</div>
