import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useExpenses } from '../../hooks/useExpenses'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import './Chart.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

export default function LineChart() {
  const { expenses } = useExpenses()

  if (expenses.length === 0) {
    return <div className="chart-empty">Aucune donnée</div>
  }

  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const dailyTotals = {}
  daysInMonth.forEach((day) => {
    const key = format(day, 'dd/MM', { locale: fr })
    dailyTotals[key] = 0
  })

  expenses.forEach((exp) => {
    const expDate = new Date(exp.date?.seconds * 1000 || exp.date)
    if (
      expDate >= monthStart &&
      expDate <= monthEnd
    ) {
      const key = format(expDate, 'dd/MM', { locale: fr })
      dailyTotals[key] += exp.amount
    }
  })

  const labels = Object.keys(dailyTotals)
  const data = Object.values(dailyTotals)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Dépenses quotidiennes (€)',
        data,
        borderColor: var(--primary-color),
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  return (
    <div className="chart-container">
      <h3>Tendance du mois</h3>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  )
}
