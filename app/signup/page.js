'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '../../lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e) {
    e.preventDefault()
    setMsg('Creating account...')
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setMsg(error.message); return }
    // RLS is off, so the anon key can insert the profile row directly.
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id, email, full_name: fullName, role: 'customer',
      })
    }
    setMsg('Account created. You can now log in.')
    setTimeout(() => router.push('/login'), 900)
  }

  return (
    <main className="container" style={{ maxWidth: 440 }}>
      <h1>Create your account</h1>
      <form onSubmit={submit}>
        <label>Full name</label>
        <input value={fullName} onChange={e => setFullName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div style={{ marginTop: 16 }}><button className="btn" type="submit">Sign up</button></div>
      </form>
      {msg && <p className="notice" style={{ marginTop: 16 }}>{msg}</p>}
    </main>
  )
}
