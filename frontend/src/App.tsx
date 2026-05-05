import { useState, useEffect, useRef } from 'react'

interface Quote {
  symbol: string
  shortName: string
  regularMarketPrice: number
  regularMarketChangePercent: number
}

interface Quotes {
  LWSA3: Quote
  IBOV: Quote
  USD: Quote
}

function QuoteCard({ data, label }: { data: Quote; label: string }) {
  const isUp  = data.regularMarketChangePercent >= 0
  const color = isUp ? '#00a651' : '#e63946'
  const arrow = isUp ? '▲' : '▼'

  return (
    <div style={{
      background: '#1e1e2e',
      border: '1px solid #333',
      borderRadius: '12px',
      padding: '24px',
      minWidth: '200px',
      textAlign: 'center'
    }}>
      <div style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>
        {data.regularMarketPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </div>
      <div style={{ color, fontSize: '14px' }}>
        {arrow} {Math.abs(data.regularMarketChangePercent).toFixed(2)}%
      </div>
    </div>
  )
}

export default function App() {
  const [quotes,  setQuotes]  = useState<Quotes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    // Cria o Web Worker
    workerRef.current = new Worker(new URL('./quotesWorker.js', import.meta.url))

    // Recebe dados do worker
    workerRef.current.onmessage = (e) => {
      if (e.data.success) {
        setQuotes(e.data.data)
        setLoading(false)
      } else {
        setError('Erro ao carregar cotacoes')
        setLoading(false)
      }
    }

    // Funcao que dispara a busca no worker
    const load = () => {
      workerRef.current?.postMessage({ url: 'http://localhost:3001/quotes' })
    }

    load()
    const timer = setInterval(load, 30000)

    return () => {
      clearInterval(timer)
      workerRef.current?.terminate()
    }
  }, [])

  if (loading) return <p style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>Carregando...</p>
  if (error)   return <p style={{ color: 'red',  textAlign: 'center', marginTop: '100px' }}>{error}</p>
  if (!quotes) return null

  return (
    <div style={{ background: '#13131f', minHeight: '100vh', padding: '40px 20px' }}>
      <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '8px', fontSize: '28px' }}>
        Cotações ao Vivo
      </h1>
      <p style={{ color: '#555', textAlign: 'center', marginBottom: '40px', fontSize: '13px' }}>
        Atualizado via Web Worker a cada 30s
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <QuoteCard data={quotes.LWSA3} label="LWSA3 — Locaweb" />
        <QuoteCard data={quotes.IBOV}  label="IBOV — Ibovespa" />
        <QuoteCard data={quotes.USD}   label="USD — Dólar" />
      </div>
    </div>
  )
}