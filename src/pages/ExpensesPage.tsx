import ExpenseForm from '../components/Expenses/ExpenseForm'
import ExpenseList from '../components/Expenses/ExpenseList'
import Sidebar from '../components/Sidebar'
import './HomePage.css'

export default function ExpensesPage() {
  return (
    <div className="home-page">
      <Sidebar activePath="/expenses" />

      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="content-header">
            <h2>Mes Dépenses</h2>
            <p>Ajoutez et gérez vos dépenses</p>
          </div>

          <div className="form-section">
            <ExpenseForm />
          </div>

          <section className="list-section">
            <ExpenseList />
          </section>
        </div>
      </div>
    </div>
  )
}
