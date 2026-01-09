<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/layout/sidebar.svelte';
	import BottomNav from '$lib/components/layout/bottom-nav.svelte';
  import { onMount } from 'svelte';
  import { goto, invalidate } from '$app/navigation';

	let { data, children } = $props();

    onMount(() => {
        const {
            data: { subscription }
        } = data.supabase.auth.onAuthStateChange((_, newSession) => {
            if(!newSession) {
                setTimeout(() => {
					goto('/', { invalidateAll: true });
				});
            }
            if (newSession?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}
        })

        return () => subscription.unsubscribe();
    })

</script>

<div class="flex min-h-screen bg-background text-foreground">
    <!-- Desktop Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 pb-20 md:pb-0">
        <div class="container mx-auto max-w-5xl p-4 md:p-8">
            {@render children()}
        </div>
    </main>

    <!-- Mobile Bottom Nav -->
    <BottomNav />
</div>
