import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../services/firebase/init'
import './AuthPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Veuillez entrer votre email')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess('Email de réinitialisation envoyé. Vérifiez votre boîte de réception.')
      setShowForgotPassword(false)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-image">
          <div className="image-placeholder">
            <div className="image-gradient"></div>
            <div className="image-content">
              <h2>Gérez vos dépenses</h2>
              <p>Suivez et catégorisez vos dépenses facilement</p>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-container">
            <h2>Gérez vos dépenses</h2>
            <p>Suivez et catégorisez vos dépenses facilement</p>
            <h1>Connexion</h1>
            <p className="auth-subtitle">Bienvenue ! Connectez-vous à votre compte</p>

            {!showForgotPassword ? (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mot de passe</label>
                  <div className="password-field-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowPassword(!showPassword)
                      }}
                    >
                      <img
                        src={showPassword ? '/images/eye-on-svgrepo-com.svg' : '/images/eye-off-svgrepo-com.svg'}
                        alt={showPassword ? 'Masquer' : 'Afficher'}
                      />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            ) : (
              <div className="auth-form">
                <div className="form-group">
                  <label>Entrez votre email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Envoi en cours...' : 'Réinitialiser'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="btn-secondary"
                >
                  Retour
                </button>
              </div>
            )}

            <div className="auth-divider">
              <span>OU</span>
            </div>

            <p className="auth-signup">
              Pas de compte ? <Link to="/register">S'inscrire</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
