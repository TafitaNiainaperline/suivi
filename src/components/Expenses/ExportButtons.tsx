import jsPDF from 'jspdf'
import { useExpenses } from '../../hooks/useExpenses'
import { useToast } from '../../hooks/useToast'
import './ExportButtons.css'

export default function ExportButtons() {
  const { expenses } = useExpenses()
  const { showToast } = useToast()

  const getDate = (e: any) =>
    new Date((e.date as any)?.seconds * 1000 || (e.date as any))

  const exportCSV = () => {
    if (expenses.length === 0) { showToast('Aucune dépense à exporter', 'info'); return }
    const rows = [
      ['Date', 'Catégorie', 'Montant (Ar)'],
      ...expenses.map((e) => [
        getDate(e).toLocaleDateString('fr-FR'),
        e.category || 'Sans catégorie',
        e.amount,
      ]),
    ]
    const csv = rows.map((r) => r.join(';')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `depenses_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Export CSV téléchargé')
  }

  const exportPDF = () => {
    if (expenses.length === 0) { showToast('Aucune dépense à exporter', 'info'); return }

    const sorted = [...expenses].sort(
      (a, b) => getDate(b).getTime() - getDate(a).getTime()
    )
    const total = sorted.reduce((s, e) => s + (e.amount || 0), 0)

    const doc = new jsPDF()

    // Titre
    doc.setFontSize(18)
    doc.setTextColor(99, 102, 241)
    doc.text('Rapport des dépenses', 14, 20)

    // Date export
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28)

    // En-têtes tableau
    const startY = 36
    doc.setFillColor(99, 102, 241)
    doc.rect(14, startY, 182, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Date', 16, startY + 5.5)
    doc.text('Catégorie', 60, startY + 5.5)
    doc.text('Montant (Ar)', 150, startY + 5.5)

    // Lignes
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    let y = startY + 8

    sorted.forEach((e, i) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      if (i % 2 === 0) {
        doc.setFillColor(241, 245, 249)
        doc.rect(14, y, 182, 7, 'F')
      }
      doc.setTextColor(15, 23, 42)
      doc.text(getDate(e).toLocaleDateString('fr-FR'), 16, y + 5)
      doc.text(e.category || 'Sans catégorie', 60, y + 5)
      doc.text(Number(e.amount).toLocaleString('fr-FR') + ' Ar', 150, y + 5)
      y += 7
    })

    // Total
    y += 4
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(15, 23, 42)
    doc.text(`Total : ${total.toLocaleString('fr-FR')} Ar`, 150, y)

    doc.save(`depenses_${new Date().toISOString().split('T')[0]}.pdf`)
    showToast('PDF téléchargé')
  }

  return (
    <div className="export-buttons">
      <button onClick={exportCSV} className="btn-export btn-csv">CSV</button>
      <button onClick={exportPDF} className="btn-export btn-pdf">PDF</button>
    </div>
  )
}
