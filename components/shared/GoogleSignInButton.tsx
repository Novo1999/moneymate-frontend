'use client'

import { useAuth } from '@/app/hooks/use-auth'
import Script from 'next/script'
import { useCallback, useRef } from 'react'

// The Google "Web client" OAuth client ID — the same one the backend verifies
// (GOOGLE_CLIENT_ID) and the mobile app uses (EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID).
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

/**
 * "Continue with Google" via Google Identity Services. The credential returned by
 * GIS is a Google ID token — the same thing the mobile app sends — which we POST
 * to the backend's /auth/google to establish a normal session.
 *
 * Renders nothing when NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.
 */
export default function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)

  const setup = useCallback(() => {
    if (!CLIENT_ID || !window.google || !containerRef.current) return
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => loginWithGoogle(response.credential),
    })
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      width: Math.min(400, containerRef.current.offsetWidth || 400),
    })
  }, [loginWithGoogle])

  if (!CLIENT_ID) return null

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={setup} />
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>
      <div ref={containerRef} className="flex justify-center" />
    </>
  )
}
