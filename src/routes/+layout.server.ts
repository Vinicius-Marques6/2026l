import type { LayoutServerLoad } from './$types'
import { getUserProfile } from '$lib/auth';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  const { session, user } = await locals.safeGetSession()

  const profile = user ? await getUserProfile(locals) : null;

  return {
    session,
    user,
    profile,
    cookies: cookies.getAll(),
  }
}