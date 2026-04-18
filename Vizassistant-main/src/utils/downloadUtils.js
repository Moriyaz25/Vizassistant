import jsPDF from 'jspdf'

// ── Lazy load html2canvas ─────────────────────────────────────────────────────
const getHtml2Canvas = async () => {
    const { default: html2canvas } = await import('html2canvas')
    return html2canvas
}

// ── Capture DOM element as canvas ────────────────────────────────────────────
const captureElement = async (elementId) => {
    const node = document.getElementById(elementId)
    if (!node) throw new Error(`Element #${elementId} not found`)

    const html2canvas = await getHtml2Canvas()

    return await html2canvas(node, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#060817',
        scale: 2,
        logging: false,
        ignoreElements: (el) =>
            (el.tagName === 'LINK' && el.href?.includes('fonts.googleapis.com')) ||
            (el.tagName === 'LINK' && el.href?.includes('fonts.gstatic.com'))
    })
}

// ── 1. Download chart as PNG ──────────────────────────────────────────────────
export const downloadChartAsPNG = async (elementId, fileName = 'chart.png') => {
    try {
        const canvas = await captureElement(elementId)
        const link   = document.createElement('a')
        link.download = fileName
        link.href     = canvas.toDataURL('image/png')
        link.click()
    } catch (err) {
        console.error('PNG export failed:', err)
        alert('PNG export failed: ' + err.message)
    }
}

// ── 2. Export full report as PDF ──────────────────────────────────────────────
export const exportFullReportAsPDF = async (elementId, insightsText, name = 'report') => {
    const pdf   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const margin = 15

    try {
        // Page 1 — Chart
        try {
            const canvas  = await captureElement(elementId)
            const imgData = canvas.toDataURL('image/png')
            const node    = document.getElementById(elementId)
            const ratio   = node ? node.offsetHeight / node.offsetWidth : 0.6
            const imgW    = pageW - margin * 2
            const imgH    = Math.min(imgW * ratio, pageH - margin * 2)

            pdf.setFillColor(6, 8, 23)
            pdf.rect(0, 0, pageW, pageH, 'F')
            pdf.addImage(imgData, 'PNG', margin, margin, imgW, imgH)
        } catch (err) {
            console.warn('Chart capture skipped:', err.message)
        }

        // Page 2 — Insights text
        if (insightsText) {
            pdf.addPage()
            pdf.setFillColor(6, 8, 23)
            pdf.rect(0, 0, pageW, pageH, 'F')

            pdf.setFontSize(20)
            pdf.setTextColor(172, 187, 198)
            pdf.setFont('helvetica', 'bold')
            pdf.text('AI Strategic Report', margin, margin + 8)

            pdf.setFontSize(9)
            pdf.setTextColor(100, 100, 120)
            pdf.setFont('helvetica', 'normal')
            pdf.text(
                `Generated: ${new Date().toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })}`,
                margin, margin + 16
            )

            pdf.setDrawColor(102, 125, 157)
            pdf.setLineWidth(0.3)
            pdf.line(margin, margin + 21, pageW - margin, margin + 21)

            const clean = cleanMarkdown(insightsText)
            const lines = pdf.splitTextToSize(clean, pageW - margin * 2)
            let y = margin + 30

            for (const line of lines) {
                if (y > pageH - margin) {
                    pdf.addPage()
                    pdf.setFillColor(6, 8, 23)
                    pdf.rect(0, 0, pageW, pageH, 'F')
                    y = margin + 10
                }
                if (line.startsWith('• ')) {
                    pdf.setTextColor(172, 187, 198)
                    pdf.setFont('helvetica', 'bold')
                } else {
                    pdf.setTextColor(200, 200, 210)
                    pdf.setFont('helvetica', 'normal')
                }
                pdf.setFontSize(10)
                pdf.text(line, margin, y)
                y += 6
            }
        }

        pdf.save(`${name}_report.pdf`)
    } catch (err) {
        console.error('PDF export failed:', err)
        alert('PDF export failed: ' + err.message)
    }
}

// ── 3. Export data as CSV ─────────────────────────────────────────────────────
export const exportDataAsCSV = (data, fileName = 'data.csv') => {
    if (!data || data.length === 0) {
        console.warn('No data to export')
        return
    }

    const headers = Object.keys(data[0])
    const rows    = data.map(row =>
        headers.map(h => {
            const val = String(row[h] ?? '')
            return val.includes(',') || val.includes('\n')
                ? `"${val.replace(/"/g, '""')}"`
                : val
        }).join(',')
    )

    downloadBlob(
        [headers.join(','), ...rows].join('\n'),
        fileName,
        'text/csv;charset=utf-8;'
    )
}

// ── 4. Export insights as TXT ─────────────────────────────────────────────────
export const exportInsightsAsTxt = (insightsText, fileName = 'insights.txt') => {
    if (!insightsText) { console.warn('No insights to export'); return }

    const header = [
        'VIZASSISTANT - AI INSIGHTS REPORT',
        `Generated: ${new Date().toLocaleString('en-IN')}`,
        '='.repeat(50),
        '',
        ''
    ].join('\n')

    downloadBlob(header + cleanMarkdown(insightsText), fileName, 'text/plain;charset=utf-8;')
}

// ── 5. Export as PowerPoint (.pptx via pptxgenjs) ────────────────────────────
export const exportAsPowerPoint = async (elementId, insightsText, name = 'report') => {
    try {
        // Dynamically import pptxgenjs (install: npm i pptxgenjs)
        const { default: PptxGenJS } = await import('pptxgenjs')
        const pptx = new PptxGenJS()

        pptx.layout  = 'LAYOUT_WIDE'
        pptx.author  = 'Vizassistant'
        pptx.company = 'Vizassistant AI'
        pptx.subject = 'AI Data Report'
        pptx.title   = `${name} Report`

        const BG    = '060817'
        const BLUE  = '667D9D'
        const LIGHT = 'ACBBC6'

        // ── Slide 1: Title slide ───────────────────────────────────────────
        const slide1 = pptx.addSlide()
        slide1.background = { color: BG }

        slide1.addShape(pptx.ShapeType.rect, {
            x: 0, y: 3.5, w: '100%', h: 0.04,
            fill: { color: BLUE }, line: { color: BLUE }
        })
        slide1.addText('AI Strategic Report', {
            x: 0.5, y: 1.2, w: 9, h: 1.2,
            fontSize: 40, bold: true,
            color: LIGHT, fontFace: 'Calibri'
        })
        slide1.addText(name, {
            x: 0.5, y: 2.4, w: 9, h: 0.6,
            fontSize: 20, color: BLUE, fontFace: 'Calibri'
        })
        slide1.addText(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, {
            x: 0.5, y: 4.2, w: 9, h: 0.4,
            fontSize: 12, color: '888888', fontFace: 'Calibri'
        })
        slide1.addText('Powered by Vizassistant AI', {
            x: 0.5, y: 4.7, w: 9, h: 0.4,
            fontSize: 11, color: BLUE, fontFace: 'Calibri', italic: true
        })

        // ── Slide 2: Chart image ───────────────────────────────────────────
        try {
            const canvas  = await captureElement(elementId)
            const imgData = canvas.toDataURL('image/png')

            const slide2 = pptx.addSlide()
            slide2.background = { color: BG }
            slide2.addText('Data Visualization', {
                x: 0.5, y: 0.3, w: 9, h: 0.6,
                fontSize: 22, bold: true, color: LIGHT, fontFace: 'Calibri'
            })
            slide2.addShape(pptx.ShapeType.rect, {
                x: 0.5, y: 0.95, w: 9, h: 0.03,
                fill: { color: BLUE }, line: { color: BLUE }
            })
            slide2.addImage({
                data: imgData,
                x: 0.5, y: 1.2, w: 9, h: 5.2
            })
        } catch (err) {
            console.warn('Chart slide skipped:', err.message)
        }

        // ── Slide 3+: Insights ─────────────────────────────────────────────
        if (insightsText) {
            const clean  = cleanMarkdown(insightsText)
            const chunks = chunkText(clean, 900) // ~900 chars per slide

            chunks.forEach((chunk, i) => {
                const slide = pptx.addSlide()
                slide.background = { color: BG }

                slide.addText(`AI Insights${chunks.length > 1 ? ` (${i + 1}/${chunks.length})` : ''}`, {
                    x: 0.5, y: 0.3, w: 9, h: 0.6,
                    fontSize: 22, bold: true, color: LIGHT, fontFace: 'Calibri'
                })
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5, y: 0.95, w: 9, h: 0.03,
                    fill: { color: BLUE }, line: { color: BLUE }
                })
                slide.addText(chunk, {
                    x: 0.5, y: 1.2, w: 9, h: 5.2,
                    fontSize: 13, color: 'C8C8D2',
                    fontFace: 'Calibri', valign: 'top',
                    breakLine: true, paraSpaceAfter: 6
                })
            })
        }

        await pptx.writeFile({ fileName: `${name}_report.pptx` })
    } catch (err) {
        console.error('PowerPoint export failed:', err)
        // Graceful fallback — export as styled HTML
        exportAsHTMLFallback(elementId, insightsText, name)
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const cleanMarkdown = (text) =>
    text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/^\s*[-•]\s/gm, '• ')

const chunkText = (text, maxLen) => {
    const chunks = []
    let start = 0
    while (start < text.length) {
        let end = start + maxLen
        if (end < text.length) {
            // Break at last newline within limit
            const lastNL = text.lastIndexOf('\n', end)
            if (lastNL > start) end = lastNL
        }
        chunks.push(text.slice(start, end).trim())
        start = end
    }
    return chunks
}

const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href     = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
}

const exportAsHTMLFallback = async (elementId, insightsText, name) => {
    try {
        const canvas  = await captureElement(elementId)
        const imgData = canvas.toDataURL('image/png')
        const clean   = cleanMarkdown(insightsText || '')

        const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<title>${name} Report</title>
<style>
  body{font-family:Calibri,sans-serif;background:#060817;color:#fff;margin:40px}
  h1{color:#ACBBC6;border-bottom:2px solid #667D9D;padding-bottom:10px}
  img{max-width:100%;border-radius:12px;margin:20px 0}
  p{font-size:14px;line-height:1.8;color:#CBD5DC}
  .date{font-size:11px;color:#667D9D}
</style></head>
<body>
<h1>AI Strategic Report — ${name}</h1>
<p class="date">Generated: ${new Date().toLocaleString('en-IN')}</p>
<img src="${imgData}" alt="Chart"/>
<p>${clean.replace(/\n/g, '<br/>')}</p>
</body></html>`

        downloadBlob(html, `${name}_report.html`, 'text/html;charset=utf-8;')
    } catch (err) {
        console.error('HTML fallback also failed:', err)
    }
}