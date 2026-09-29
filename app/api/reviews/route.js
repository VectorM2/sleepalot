import { NextResponse } from 'next/server'
import { getSupabase } from '../../../lib/supabaseClient'
import { getCurrentUid } from '../../../lib/session'

export const dynamic = 'force-dynamic'

// VULNERABLE: stores the review body verbatim (no sanitisation / encoding),
// and does not require a real authenticated session — it trusts the
// unsigned sa_uid cookie (or nothing at all). The stored HTML is later
// rendered raw on the product page => stored XSS.
export async function POST(req) {
  const supabase = getSupabase()
  const uid = getCurrentUid() // may be null; not verified
  try {
    const { product_id, author_name, body, rating } = await req.json()
    const { error } = await supabase.from('reviews').insert({
      product_id,
      user_id: uid,
      author_name: author_name || 'Anonymous',
      body,                       // <-- stored as-is
      rating: rating || 5,
    })
    if (error) return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 })
  }
}
