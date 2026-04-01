import { useState } from 'react'
import { useExpenses } from '../../hooks/useExpenses'
import ExpenseCard from './ExpenseCard'
import './ExpenseList.css'

const ITEMS_PER_PAGE = 5

type SortField = 'date' | 'amount'
type SortDir = 'desc' | 'asc'

export default function ExpenseList() {
  const { expenses, loading } = useExpenses()
  const [search, setSearch] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  if (loading) return <div className="loading">Chargement...</div>

  const getDate = (e: any) => new Date((e.date as any)?.seconds * 1000 || (e.date as any))

  // Années disponibles
  const years = [...new Set(expenses.map((e) => String(getDate(e).getFullYear())))].sort((a, b) => b.localeCompare(a))

  // Mois disponibles selon l'année sélectionnée
  const months = [...new Set(
    expenses
      .filter((e) => filterYear === '' || String(getDate(e).getFullYear()) === filterYear)
      .map((e) => {
        const d = getDate(e)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      })
  )].sort((a, b) => b.localeCompare(a))

  const categories = [...new Set(expenses.map((e) => e.category).filter(Boolean))]

  const filtered = expenses.filter((e) => {
    const d = getDate(e)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const matchSearch = search === '' || (e.category || '').toLowerCase().includes(search.toLowerCase()) || String(e.amount).includes(search)
    const matchYear = filterYear === '' || String(d.getFullYear()) === filterYear
    const matchMonth = filterMonth === '' || monthKey === filterMonth
    const matchCategory = filterCategory === '' || e.category === filterCategory
    const matchMin = minAmount === '' || Number(e.amount) >= Number(minAmount)
    const matchMax = maxAmount === '' || Number(e.amount) <= Number(maxAmount)
    return matchSearch && matchYear && matchMonth && matchCategory && matchMin && matchMax
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'date') {
      const diff = getDate(a).getTime() - getDate(b).getTime()
      return sortDir === 'desc' ? -diff : diff
    } else {
      const diff = Number(a.amount) - Number(b.amount)
      return sortDir === 'desc' ? -diff : diff
    }
  })

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setter(e.target.value)
    setPage(1)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterYear(e.target.value)
    setFilterMonth('')
    setPage(1)
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
    setPage(1)
  }

  const hasFilters = search || filterYear || filterMonth || filterCategory || minAmount || maxAmount

  return (
    <div className="expense-list">
      <div className="list-filters">
        <input
          className="filter-search"
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={handleChange(setSearch)}
        />

        <select value={filterYear} onChange={handleYearChange} className="filter-select">
          <option value="">Toutes années</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select value={filterMonth} onChange={handleChange(setFilterMonth)} className="filter-select">
          <option value="">Tous les mois</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(m + '-01').toLocaleDateString('fr-FR', { month: 'long', year: filterYear ? undefined : 'numeric' })}
            </option>
          ))}
        </select>

        <select value={filterCategory} onChange={handleChange(setFilterCategory)} className="filter-select">
          <option value="">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="filter-amount-range">
          <input
            className="filter-amount"
            type="number"
            placeholder="Min Ar"
            value={minAmount}
            onChange={handleChange(setMinAmount)}
            min="0"
          />
          <span className="amount-separator">–</span>
          <input
            className="filter-amount"
            type="number"
            placeholder="Max Ar"
            value={maxAmount}
            onChange={handleChange(setMaxAmount)}
            min="0"
          />
        </div>

        {hasFilters && (
          <button className="filter-reset" onClick={() => {
            setSearch(''); setFilterYear(''); setFilterMonth('')
            setFilterCategory(''); setMinAmount(''); setMaxAmount(''); setPage(1)
          }}>
            Réinitialiser
          </button>
        )}
      </div>

      <div className="list-sort">
        <span className="sort-label">Trier par :</span>
        <button
          className={`sort-btn ${sortField === 'date' ? 'active' : ''}`}
          onClick={() => toggleSort('date')}
        >
          Date {sortField === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
        </button>
        <button
          className={`sort-btn ${sortField === 'amount' ? 'active' : ''}`}
          onClick={() => toggleSort('amount')}
        >
          Montant {sortField === 'amount' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
        </button>
        {filtered.length > 0 && (
          <span className="results-count">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">Aucune dépense trouvée</div>
      ) : (
        <>
          <div className="cards-container">
            {paginated.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="page-btn">←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`page-btn ${p === page ? 'active' : ''}`}>{p}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="page-btn">→</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
