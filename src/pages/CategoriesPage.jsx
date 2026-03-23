import { useAuth } from '../hooks/useAuth'
import { EXPENSE_CATEGORIES } from '../utils/constants'
import './HomePage.css'

export default function CategoriesPage() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

  return (
    <div className="home-page">
      <aside className="sidebar-nav">
        <div className="logo">
          <h3>Suivi</h3>
        </div>

        <nav className="nav-menu">
          <a href="/" className="nav-item">
            <img src="/images/dashboard-svgrepo-com.svg" alt="Dashboard" className="nav-icon-img" />
            <span>Dashboard</span>
          </a>
          <a href="/expenses" className="nav-item">
            <img src="/images/budget-svgrepo-com.svg" alt="Dépenses" className="nav-icon-img" />
            <span>Dépenses</span>
          </a>
          <a href="/categories" className="nav-item active">
            <img src="/images/category-svgrepo-com.svg" alt="Catégories" className="nav-icon-img" />
            <span>Catégories</span>
          </a>
          <a href="/reports" className="nav-item">
            <img src="/images/budget-svgrepo-com.svg" alt="Rapports" className="nav-icon-img" />
            <span>Rapports</span>
          </a>
        </nav>

        <div className="nav-footer">
          <button onClick={handleLogout} className="btn-user-logout">
            <img src="/images/user-svgrepo-com.svg" alt="User" className="user-avatar-footer" />
            <div className="user-logout-info">
              <span className="user-name-footer">{user?.email?.split('@')[0]}</span>
              <span className="logout-text">Déconnexion</span>
            </div>
          </button>
        </div>
      </aside>

      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="content-header">
            <h2>Catégories</h2>
            <p>Gérez vos catégories de dépenses</p>
          </div>

          <div className="categories-grid">
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat.id} className="category-card">
                <div className="category-icon" style={{ backgroundColor: cat.color }}>
                  {cat.icon}
                </div>
                <h3>{cat.name}</h3>
                <p>Dépenses</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
