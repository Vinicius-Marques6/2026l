import { redirect } from '@sveltejs/kit';
import { getOrLinkUserProfile } from '$lib/auth/index.js';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get('code') as string;
	const next = url.searchParams.get('next') ?? '/';

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const profile = await getOrLinkUserProfile(event.locals);
      if (profile) {
        redirect(303, `/${next.slice(1)}`);
      }
    }
  }

  // return the user to an error page with instructions
  redirect(303, '/auth/auth-code-error');
};