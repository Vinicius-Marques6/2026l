import { redirect } from "@sveltejs/kit"

export const actions = {
    default: async ({ locals, url }) => {
        const { data, error } = await locals.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: url.origin + '/auth/callback',
            },
        })

        if (data.url) {
            redirect(303, data.url)
        }

        return { success: false }
    }
}