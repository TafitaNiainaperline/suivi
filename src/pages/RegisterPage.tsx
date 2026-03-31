import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './AuthPage.css'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      await register(email, password)
      navigate('/')
    } catch (err: any) {
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
              <h2>Commencez maintenant</h2>
              <p>Créez votre compte et gérez vos dépenses</p>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-container">
            <h2>Commencez maintenant</h2>
            <p>Créez votre compte et gérez vos dépenses</p>
            <h1>Inscription</h1>
            <p className="auth-subtitle">Créez votre compte pour commencer</p>

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
              </div>

              <div className="form-group">
                <label>Confirmer mot de passe</label>
                <div className="password-field-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowConfirmPassword(!showConfirmPassword)
                    }}
                  >
                    <img
                      src={showConfirmPassword ? '/images/eye-on-svgrepo-com.svg' : '/images/eye-off-svgrepo-com.svg'}
                      alt={showConfirmPassword ? 'Masquer' : 'Afficher'}
                    />
                  </button>
                </div>
              </div>

              {error && <div className="error">{error}</div>}

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </form>

            <div className="auth-divider">
              <span>OU</span>
            </div>

            <p className="auth-signup">
              Déjà inscrit ? <Link to="/login">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
