// ─── aiService.js ─────────────────────────────────────────────────────────────
const OR_KEY   = import.meta.env.VITE_OPENROUTER_API_KEY
const OR_MODEL = 'google/gemini-2.0-flash-001'
const OR_URL   = 'https://openrouter.ai/api/v1/chat/completions'

// ── Shared fetch wrapper ──────────────────────────────────────────────────────
const callOpenRouter = async (messages, maxTokens = 1500) => {
    if (!OR_KEY) {
        throw new Error('AI_UNAVAILABLE: VITE_OPENROUTER_API_KEY is not set in .env')
    }

    const res = await fetch(OR_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OR_KEY}`,
            'Content-Type':  'application/json',
            'HTTP-Referer':  window.location.origin,
            'X-Title':       'Vizassistant',
        },
        body: JSON.stringify({
            model:       OR_MODEL,
            messages,
            max_tokens:  maxTokens,
            temperature: 0.7,
        }),
    })

    const data = await res.json()

    if (!res.ok) {
        if (res.status === 401) throw new Error('AUTH_ERROR: Invalid OpenRouter API key.')
        if (res.status === 429) throw new Error('QUOTA_EXCEEDED: Rate limit hit. Try again in a moment.')
        if (res.status === 402) throw new Error('QUOTA_EXCEEDED: OpenRouter credits exhausted.')
        throw new Error(`ERROR: ${data?.error?.message || `HTTP ${res.status}`}`)
    }

    return data.choices?.[0]?.message?.content || ''
}

// ── 1. Generate Insights ──────────────────────────────────────────────────────
export const generateInsights = async (data) => {
    if (!OR_KEY) return 'AI_UNAVAILABLE: Please set VITE_OPENROUTER_API_KEY in your .env file.'
    if (!data || data.length === 0) return 'No data available to analyze.'

    const preview = data.slice(0, 100)
    const cols    = Object.keys(preview[0] || {})

    const prompt = `You are a professional data analyst. Analyze this dataset and generate a concise report.

Dataset info:
- Total rows: ${data.length}
- Columns: ${cols.join(', ')}
- Sample data (first 100 rows): ${JSON.stringify(preview)}

Instructions:
- Write a brief overview paragraph (2-3 sentences)
- List 4-6 key actionable insights as bullet points
- Highlight any anomalies, trends, or opportunities
- Use **bold** for emphasis on important numbers or findings
- Format output as clean Markdown only`

    try {
        return await callOpenRouter([
            { role: 'system', content: 'You are a professional data analyst. Return only clean Markdown.' },
            { role: 'user',   content: prompt },
        ], 1500)
    } catch (err) {
        console.error('generateInsights error:', err)
        if (err.message.startsWith('QUOTA_EXCEEDED')) return `QUOTA_EXCEEDED: ${err.message}`
        if (err.message.startsWith('AUTH_ERROR'))     return `AI_UNAVAILABLE: ${err.message}`
        if (err.message.startsWith('AI_UNAVAILABLE')) return err.message
        return `ERROR: ${err.message}`
    }
}

// ── 2. Ask AI ─────────────────────────────────────────────────────────────────
export const askAI = async (query, contextData) => {
    if (!OR_KEY)      return 'AI_UNAVAILABLE: Please set VITE_OPENROUTER_API_KEY in your .env file.'
    if (!query?.trim()) return 'Please ask a question.'

    const preview = contextData
        ? JSON.stringify(contextData.slice(0, 80))
        : 'No data loaded.'

    const cols = contextData?.[0] ? Object.keys(contextData[0]).join(', ') : 'unknown'

    const prompt = `You are a helpful data analyst for the Vizassistant platform.

Dataset context:
- Columns: ${cols}
- Total rows: ${contextData?.length || 0}
- Sample data (first 80 rows): ${preview}

User question: ${query}

Guidelines:
- Answer directly and accurately from the data
- Keep response concise (3-5 sentences max)
- Use Markdown for numbers, lists, or comparisons
- If the question cannot be answered from the data, say so politely`

    try {
        return await callOpenRouter([
            { role: 'system', content: 'You are a helpful data analyst assistant. Be concise and accurate.' },
            { role: 'user',   content: prompt },
        ], 800)
    } catch (err) {
        console.error('askAI error:', err)
        if (err.message.startsWith('QUOTA_EXCEEDED')) return `QUOTA_EXCEEDED: ${err.message}`
        if (err.message.startsWith('AUTH_ERROR'))     return 'AUTH_ERROR: Invalid API key.'
        if (err.message.startsWith('AI_UNAVAILABLE')) return err.message
        return `ERROR: ${err.message}`
    }
}