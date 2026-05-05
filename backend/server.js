const express = require('express')
const cors = require('cors')
require('dotenv').config()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.get('/quotes', async (req, res) => {
  try {
    const token = process.env.BRAPI_TOKEN

    const lwsa3Res  = await fetch(`https://brapi.dev/api/quote/LWSA3?token=${token}`)
    const lwsa3Json = await lwsa3Res.json()

    const ibovRes  = await fetch(`https://brapi.dev/api/quote/%5EBVSP?token=${token}`)
    const ibovJson = await ibovRes.json()

    const usdRes  = await fetch(`https://brapi.dev/api/quote/USDBRL=X?token=${token}`)
    const usdJson = await usdRes.json()

    console.log('LWSA3:', lwsa3Json.error || 'OK')
    console.log('IBOV:', ibovJson.error || 'OK')
    console.log('USD:', usdJson.error || 'OK')

    res.json({
      LWSA3: lwsa3Json.results[0],
      IBOV:  ibovJson.results[0],
      USD:   usdJson.results[0]
    })
  } catch (err) {
    console.error('ERRO:', err.message)
    res.status(500).json({ error: 'Falha ao buscar cotacoes' })
  }
})

app.listen(3001, () => {
  console.log('Backend rodando em http://localhost:3001')
})