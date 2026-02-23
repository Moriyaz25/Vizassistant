import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * Fix for Tailwind v4 oklch error in html2canvas.
 * Since html2canvas doesn't support oklch, we need to ensure the capture 
 * doesn't stumble on unsupported color functions.
 */
export const downloadChartAsPNG = async (elementId, fileName = 'chart.png') => {
    const element = document.getElementById(elementId)
    if (!element) return

    try {
        // We use a clone to avoid disrupting the main UI
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            logging: false,
            useCORS: true,
            onclone: (clonedDoc) => {
                // Ensure the cloned element has a solid background if oklch fails
                const clonedElement = clonedDoc.getElementById(elementId)
                if (clonedElement) {
                    clonedElement.style.background = 'white'
                }
            }
        })
        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = fileName
        link.href = dataUrl
        link.click()
    } catch (error) {
        console.error('Failed to download PNG', error)
    }
}

export const exportReportAsPDF = async (elementId, title = 'Data Report') => {
    const element = document.getElementById(elementId)
    if (!element) return

    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById(elementId)
                if (clonedElement) {
                    clonedElement.style.background = 'white'
                }
            }
        })
        const imgData = canvas.toDataURL('image/png')

        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        pdf.setFontSize(18)
        pdf.text(title, 10, 15)
        pdf.addImage(imgData, 'PNG', 0, 25, pdfWidth, pdfHeight)
        pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
        console.error('Failed to export PDF', error)
        alert("Export failed: Some colors in your theme are not supported for PDF generation. We are working on a fix.")
    }
}
