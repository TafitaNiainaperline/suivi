import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useExpenses } from '../../hooks/useExpenses'
import { EXPENSE_CATEGORIES } from '../../utils/constants'
import './Chart.css'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PieChart() {
  const { expenses } = useExpenses()

  if (expenses.length === 0) {
    return <div className="chart-empty">Aucune donnée</div>
  }

  const categoryTotals = {}
  EXPENSE_CATEGORIES.forEach((cat) => {
    categoryTotals[cat.id] = 0
  })

  expenses.forEach((exp) => {
    if (categoryTotals[exp.category] !== undefined) {
      categoryTotals[exp.category] += exp.amount
    }
  })

  const labels = EXPENSE_CATEGORIES.map((c) => c.name)
  const data = EXPENSE_CATEGORIES.map((c) => categoryTotals[c.id])
  const backgroundColor = EXPENSE_CATEGORIES.map((c) => c.color)

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="chart-container">
      <h3>Répartition par catégorie</h3>
      <Pie data={chartData} options={{ responsive: true }} />
    </div>
  )
}
