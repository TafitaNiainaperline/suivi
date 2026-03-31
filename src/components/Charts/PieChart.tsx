import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useExpenses } from '../../hooks/useExpenses'
import './Chart.css'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ['#fbbf24', '#f87171', '#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#9ca3af', '#fb923c', '#4ade80']

export default function PieChart() {
  const { expenses } = useExpenses()

  if (expenses.length === 0) {
    return <div className="chart-empty">Aucune donnée</div>
  }

  const totals: Record<string, number> = {}
  expenses.forEach((exp) => {
    const cat = exp.category || 'Sans catégorie'
    totals[cat] = (totals[cat] || 0) + Number(exp.amount)
  })

  const labels = Object.keys(totals)
  const data = Object.values(totals)
  const backgroundColor = labels.map((_, i) => COLORS[i % COLORS.length])

  const chartData = {
    labels,
    datasets: [{ data, backgroundColor, borderColor: '#fff', borderWidth: 2 }],
  }

  return (
    <div className="chart-container">
      <h3>Répartition par catégorie</h3>
      <Pie data={chartData} options={{ responsive: true }} />
    </div>
  )
}
