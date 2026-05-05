function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatChange(pct) {
  const signal = pct >= 0 ? '+' : ''
  return `${signal}${pct.toFixed(2)}%`
}

function isPositive(change) {
  return change >= 0
}

function calcVariation(current, previous) {
  if (!previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}

module.exports = { formatPrice, formatChange, isPositive, calcVariation }