import PieChart from '../components/Charts/PieChart'
import BarChart from '../components/Charts/BarChart'
import LineChart from '../components/Charts/LineChart'
import Sidebar from '../components/Sidebar'
import './HomePage.css'

export default function ReportsPage() {
  return (
    <div className="home-page">
      <Sidebar activePath="/reports" />

      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="content-header">
            <h2>Rapports</h2>
            <p>Analysez vos dépenses avec des graphiques</p>
          </div>

          <section className="charts-section">
            <div className="charts-grid">
              <PieChart />
              <BarChart />
            </div>
            <div className="chart-full">
              <LineChart />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
