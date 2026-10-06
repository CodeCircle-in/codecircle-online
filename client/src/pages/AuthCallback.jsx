import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Seo from '../components/Seo'

export default function AuthCallback() {
  const [params] = useSearchParams()
  const { setTokenAndUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const userRaw = params.get('user')
    const redirectTo = params.get('redirectTo') || '/submit-resource'
    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw))
        setTokenAndUser(token, user)
        navigate(redirectTo, { replace: true })
      } catch {
        navigate(redirectTo, { replace: true })
      }
    } else {
      navigate(redirectTo, { replace: true })
    }
  }, [navigate, params, setTokenAndUser])

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6">
      <Seo
        title="Signing In"
        description="Completing your sign in to CodeCircle."
        path="/auth/callback"
        noindex
      />
      <div className="w-10 h-10 rounded-full border-3 border-canvas-soft border-t-primary animate-spin mb-4" />
      <div className="text-ink font-bold text-base">Signing you into CodeCircle...</div>
      <div className="text-mute text-xs mt-1">Please wait a moment.</div>
    </div>
  )
}
