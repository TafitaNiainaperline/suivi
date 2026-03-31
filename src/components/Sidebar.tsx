import { useAuth } from '../hooks/useAuth'

const navItems = [
  { href: '/', label: 'Dashboard', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )},
  { href: '/expenses', label: 'Dépenses', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  )},
  { href: '/reports', label: 'Rapports', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )},
]

interface NavbarProps {
  activePath: string
}

export default function Sidebar({ activePath }: NavbarProps) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

  return (
    <>
      {/* Desktop navbar */}
      <header className="navbar">
        <div className="navbar-brand">Suivi</div>
        <nav className="navbar-menu">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`navbar-link${activePath === item.href ? ' active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="navbar-user">
          <span className="navbar-username">{user?.email?.split('@')[0]}</span>
          <button onClick={handleLogout} className="navbar-logout">
            Déconnexion
          </button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`mobile-nav-item${activePath === item.href ? ' active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
        <button className="mobile-nav-item" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Quitter</span>
        </button>
      </nav>
    </>
  )
}
