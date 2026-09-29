import { NextResponse } from 'next/server'
import { getSupabase } from '../../../../lib/supabaseClient'
import { getCurrentUid } from '../../../../lib/session'

export const dynamic = 'force-dynamic'

// VULNERABLE: Insecure Direct Object Reference.
// It fetches the order by the id in the URL and returns it WITHOUT checking
// that the order belongs to the caller. Change the id and you read anyone's
// order (address, items, total). RLS is also off at the DB layer, so nothing
// stops it there either.
export async function GET(req, { params }) {
  const supabase = getSupabase()
  const uid = getCurrentUid() // read but NOT enforced

  const { data: order, error } = await supabase
    .from('orders').select('*').eq('id', params.id).single()
  if (error) return NextResponse.json({ error: error.message, details: error }, { status: 404 })

  const { data: items } = await supabase
    .from('order_items').select('*, products(name)').eq('order_id', params.id)

  // Note: `uid` is returned only so you can SEE that the caller is different
  // from order.user_id. It is never used to authorise.
  return NextResponse.json({ caller_uid: uid, order, items })
}
