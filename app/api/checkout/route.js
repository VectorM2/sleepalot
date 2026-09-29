import { NextResponse } from 'next/server'
import { getSupabase } from '../../../lib/supabaseClient'
import { getCurrentUid } from '../../../lib/session'

export const dynamic = 'force-dynamic'

// Minimal checkout so orders exist to view. Trusts the sa_uid cookie for
// the buyer identity (same weak-session issue as elsewhere).
export async function POST(req) {
  const supabase = getSupabase()
  const uid = getCurrentUid()
  if (!uid) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })

  try {
    const { product_id } = await req.json()
    const { data: product, error: pErr } = await supabase
      .from('products').select('id,price').eq('id', product_id).single()
    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 })

    const { data: order, error } = await supabase.from('orders').insert({
      user_id: uid, total: product.price, status: 'paid',
      shipping_address: '123 Demo Street, Testville',
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('order_items').insert({
      order_id: order.id, product_id: product.id, quantity: 1, unit_price: product.price,
    })
    return NextResponse.json({ ok: true, order_id: order.id })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 })
  }
}
