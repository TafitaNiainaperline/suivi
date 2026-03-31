import { useAuth } from '../hooks/useAuth'
import { useCategories } from '../hooks/useCategories'
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import './HomePage.css'
import './CategoriesPage.css'

export default function CategoriesPage() {
  const { user } = useAuth()
  const { categories, loading, loadCategories, addCategory, deleteCategory } = useCategories()

  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      return loadCategories(user.uid) as (() => void) | undefined
    }
  }, [user, loadCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Le nom est requis.')
      return
    }
    if (!user) return
    setSaving(true)
    setError('')
    try {
      await addCategory(user.uid, { name: name.trim(), icon: '', color: '#9ca3af' })
      setName('')
    } catch {
      setError("Erreur lors de l'ajout.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    await deleteCategory(categoryId)
  }

  return (
    <div className="home-page">
      <Sidebar activePath="/categories" />

      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="content-header">
            <h2>Catégories</h2>
          </div>

          <form className="category-form" onSubmit={handleSubmit}>
            <div className="category-form-row">
              <input
                type="text"
                placeholder="Nom de la catégorie"
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
                className="category-input"
              />
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
            {error && <p className="form-error">{error}</p>}
          </form>

          {loading ? (
            <p className="loading-text">Chargement...</p>
          ) : categories.length === 0 ? (
            <p className="empty-text">Aucune catégorie. Créez-en une ci-dessus.</p>
          ) : (
            <ul className="categories-list">
              {categories.map((cat) => (
                <li key={cat.id} className="category-list-item">
                  <span>{cat.name}</span>
                  <button
                    className="btn-delete-cat"
                    onClick={() => handleDelete(cat.id)}
                    aria-label="Supprimer"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
