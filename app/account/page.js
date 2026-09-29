import Link from 'next/link'
import { getSupabase } from '../../lib/supabaseClient'
import { getCurrentUid } from '../../lib/session'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const uid = getCurrentUid()
  if (!uid) {
    return (
      <main className="container">
        <h1>My account</h1>
        <p className="notice">You are not logged in. <Link href="/login">Log in</Link>.</p>
      </main>
    )
  }
  const supabase = getSupabase()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', uid).single()

  return (
    <main className="container">
      <h1>My account</h1>
      <p><strong>{profile?.full_name}</strong> — {profile?.email}</p>
      <p><span className="tag">role: {profile?.role}</span></p>
      <p style={{ marginTop: 16 }}><Link className="btn" href="/account/orders">View my orders</Link></p>
      <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
        Session is held in the <code>sa_uid</code> cookie. Open DevTools and look at it.
      </p>
    </main>
  )
}
