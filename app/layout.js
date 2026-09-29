import './globals.css'
import Link from 'next/link'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'SleepALot — sleep better, live better',
  description: 'Mattresses, pillows and sleep essentials.',
}

export default function RootLayout({ children }) {
  // Reflect login state from the (weak) session cookies.
  const jar = cookies()
  const uid = jar.get('sa_uid')?.value
  const email = jar.get('sa_email')?.value

  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link className="brand" href="/">Sleep<span>ALot</span></Link>
          <Link href="/search">Search</Link>
          <Link href="/account">My account</Link>
          <div className="grow" />
          {uid ? (
            <>
              <span className="muted">Signed in as <strong>{email || 'user'}</strong></span>
              <a className="btn secondary" href="/api/logout">Log out</a>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link className="btn secondary" href="/signup">Sign up</Link>
            </>
          )}
        </nav>
        {children}
      </body>
    </html>
  )
}
