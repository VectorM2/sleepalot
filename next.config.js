/** @type {import('next').NextConfig} */
// VULNERABLE build: note the complete ABSENCE of a headers() function.
// No Content-Security-Policy, no X-Frame-Options, no HSTS, no
// X-Content-Type-Options. This is the security-misconfiguration finding.
// The hardened app (sleepalotharder) adds a headers() block.
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
