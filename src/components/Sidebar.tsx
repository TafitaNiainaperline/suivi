import { useState, useRef, useEffect } from 'react'
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
  { href: '/budget', label: 'Budget', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  )},
]

interface NavbarProps {
  activePath: string
}

export default function Sidebar({ activePath }: NavbarProps) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

  const username = user?.email?.split('@')[0] ?? ''

  return (
    <>
      {/* Desktop navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
            <path d="M3 10h18"/>
            <rect x="16" y="12" width="5" height="4" rx="1"/>
            <circle cx="18.5" cy="14" r="0.8" fill="currentColor" stroke="none"/>
          </svg>
          <span>Suivi</span>
        </div>

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

        {/* User dropdown */}
        <div className="navbar-user" ref={dropdownRef}>
          <button className="user-trigger" onClick={() => setOpen(!open)}>
            <div className="user-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </button>

          {open && (
            <div className="user-dropdown">
              <div className="user-dropdown-info">
                <div className="user-dropdown-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <p className="user-dropdown-email">{user?.email}</p>
              </div>
              <div className="user-dropdown-divider" />
              <button className="user-dropdown-logout" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Déconnexion
              </button>
            </div>
          )}
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
