import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Clears the session cookies and returns home.
export async function GET(req) {
  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set('sa_uid', '', { path: '/', maxAge: 0 })
  res.cookies.set('sa_email', '', { path: '/', maxAge: 0 })
  return res
}
