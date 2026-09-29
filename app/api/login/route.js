import { NextResponse } from 'next/server'
import { getSupabase } from '../../../lib/supabaseClient'

export const dynamic = 'force-dynamic'

// VULNERABLE login endpoint. Two planted problems:
//  1) USER ENUMERATION via distinct error messages:
//     - unknown email  => "No account found for this email"
//     - known email    => "Incorrect password for this account"
//     An attacker can therefore harvest valid accounts.
//  2) NO RATE LIMITING: unlimited password guesses (brute force).
//  3) WEAK SESSION: on success it sets `sa_uid` = the user's UUID as a
//     plain, non-httpOnly, unsigned cookie (see lib/session.js).
export async function POST(req) {
  const supabase = getSupabase()
  const { email, password } = await req.json()

  // Step 1: does the account exist? (enumeration leak)
  const { data: profile } = await supabase
    .from('profiles').select('id,email').eq('email', email).maybeSingle()
  if (!profile) {
    return NextResponse.json({ error: 'No account found for this email' }, { status: 404 })
  }

  // Step 2: check the password. No attempt counter, no lockout, no delay.
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data?.user) {
    return NextResponse.json({ error: 'Incorrect password for this account' }, { status: 401 })
  }

  // Step 3: weak session cookies (readable by JS, no signature).
  const res = NextResponse.json({ ok: true, uid: data.user.id })
  const opts = { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 }
  res.cookies.set('sa_uid', data.user.id, opts)        // VULNERABLE: exposed to document.cookie
  res.cookies.set('sa_email', data.user.email, opts)   // for the header display
  return res
}
