const { formatPrice, formatChange, isPositive, calcVariation } 
  = require('../services/formatter')

describe('formatPrice', () => {
  test('formata com 2 casas decimais', () => {
    expect(formatPrice(8.5)).toBe('8,50')
  })
  test('formata numero grande', () => {
    expect(formatPrice(125000)).toBe('125.000,00')
  })
  test('formata zero', () => {
    expect(formatPrice(0)).toBe('0,00')
  })
})

describe('formatChange', () => {
  test('positivo recebe sinal +', () => {
    expect(formatChange(1.23)).toBe('+1.23%')
  })
  test('negativo nao recebe sinal', () => {
    expect(formatChange(-0.75)).toBe('-0.75%')
  })
})

describe('isPositive', () => {
  test('true pra positivo',  () => { expect(isPositive(1)).toBe(true)  })
  test('true pra zero',      () => { expect(isPositive(0)).toBe(true)  })
  test('false pra negativo', () => { expect(isPositive(-1)).toBe(false)})
})

describe('calcVariation', () => {
  test('calcula corretamente', () => {
    expect(calcVariation(110, 100)).toBeCloseTo(10)
  })
  test('retorna 0 se previous for zero', () => {
    expect(calcVariation(100, 0)).toBe(0)
  })
})