import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './AuthPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
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
            <h1>Connexion</h1>
            <p className="auth-subtitle">Bienvenue ! Connectez-vous à votre compte</p>

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
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <a href="#" className="forgot-password">Mot de passe oublié ?</a>
              </div>

              {error && <div className="error">{error}</div>}

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

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
