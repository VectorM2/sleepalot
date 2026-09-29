import { NextResponse } from 'next/server'
import { getSupabase } from '../../../lib/supabaseClient'

export const dynamic = 'force-dynamic'

// VULNERABLE search endpoint.
// It calls the `search_products` DB function, which builds SQL by string
// concatenation (see supabase/01_schema.sql). A crafted `q` therefore
// injects SQL. On error it also returns the raw database message
// (verbose errors => information disclosure).
export async function GET(req) {
  const q = req.nextUrl.searchParams.get('q') || ''
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc('search_products', { term: q })

  if (error) {
    // VULNERABLE: leaking the raw DB error back to the client.
    return NextResponse.json(
      { error: error.message, details: error, query_term: q },
      { status: 500 }
    )
  }
  return NextResponse.json({ results: data })
}
