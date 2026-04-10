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
    <div className="min-h-screen flex items-center justify-center">
      <Seo
        title="Signing In"
        description="Completing your sign in to CodeCircle."
        path="/auth/callback"
        noindex
      />
      <div className="text-neutral-500 text-sm">Signing you in...</div>
    </div>
  )
}
