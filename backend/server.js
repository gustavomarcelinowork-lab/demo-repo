const express = require('express')
const cors = require('cors')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const Redis = require('ioredis')
require('dotenv').config()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const app = express()
app.use(cors())
app.use(express.json())

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  lazyConnect: true
})

redis.on('error', (err) => {
  console.log('Redis indisponivel:', err.message)
})

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cotacoes API',
      version: '1.0.0',
      description: 'API de cotacoes em tempo real — IBOV, LWSA3 e Dolar'
    }
  },
  apis: ['./server.js']
})
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Status da API
 *     responses:
 *       200:
 *         description: API funcionando
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

/**
 * @swagger
 * /quotes:
 *   get:
 *     summary: Retorna cotacoes atuais de IBOV, LWSA3 e Dolar
 *     description: Dados cacheados no Redis por 30 segundos
 *     responses:
 *       200:
 *         description: Cotacoes retornadas com sucesso
 *       500:
 *         description: Erro ao buscar cotacoes
 */
app.get('/quotes', async (req, res) => {
  try {
    const cached = await redis.get('quotes').catch(() => null)
    if (cached) {
      console.log('Cache hit!')
      return res.json(JSON.parse(cached))
    }

    const token = process.env.BRAPI_TOKEN

    const lwsa3Res  = await fetch(`https://brapi.dev/api/quote/LWSA3?token=${token}`)
    const lwsa3Json = await lwsa3Res.json()

    const ibovRes  = await fetch(`https://brapi.dev/api/quote/%5EBVSP?token=${token}`)
    const ibovJson = await ibovRes.json()

    const usdRes  = await fetch(`https://brapi.dev/api/quote/USDBRL=X?token=${token}`)
    const usdJson = await usdRes.json()

    const data = {
      LWSA3: lwsa3Json.results[0],
      IBOV:  ibovJson.results[0],
      USD:   usdJson.results[0]
    }

    await redis.set('quotes', JSON.stringify(data), 'EX', 30).catch(() => null)
    console.log('Cache miss — dados frescos da brapi')

    res.json(data)
  } catch (err) {
    console.error('ERRO:', err.message)
    res.status(500).json({ error: 'Falha ao buscar cotacoes' })
  }
})

app.listen(3001, () => {
  console.log('Backend rodando em http://localhost:3001')
})