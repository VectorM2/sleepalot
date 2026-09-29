import { cookies } from 'next/headers'

// VULNERABLE session handling.
// The logged-in user is identified purely by an UNSIGNED, non-httpOnly
// cookie called `sa_uid` that simply holds the user's UUID. Anyone can:
//   * read it in JavaScript (no httpOnly), and
//   * change it to another user's id (no signature / no server verification).
// So "who am I" is fully attacker-controlled. This is the broken
// authentication / session-management finding.

export function getCurrentUid() {
  return cookies().get('sa_uid')?.value || null
}
