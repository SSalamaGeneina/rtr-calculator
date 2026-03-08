import test from 'node:test'
import assert from 'node:assert/strict'

import {
  calculateDarkPeriod,
  calculateNightTemp,
  calculateRTR,
  calculateT24h,
  calculateT24hFromTemps,
  estimateIndoorPAR,
  formatDarkPeriod,
  getHeatStressLevel,
  lightPeriodToDecimal,
  round,
} from '../.test-build/calculations.js'
import { CROP_PRESETS } from '../.test-build/constants.js'

test('calculateT24h: PAR and radiation modes match verified formulas', () => {
  assert.equal(calculateT24h(17, 2, 15, 'par'), 20)
  assert.equal(calculateT24h(17, 2, 1500, 'radiation'), 20)
})

test('calculateDarkPeriod and lightPeriodToDecimal return expected time splits', () => {
  assert.equal(lightPeriodToDecimal(12, 30), 12.5)
  assert.equal(calculateDarkPeriod(12, 30), 11.5)
  assert.equal(calculateDarkPeriod(24, 0), 0)
})

test('calculateNightTemp returns expected value and handles no-dark-period edge case', () => {
  assert.equal(calculateNightTemp(20, 24, 12, 0), 16)
  assert.equal(calculateNightTemp(22, 25, 24, 0), null)
})

test('estimateIndoorPAR applies transmission and shading factors correctly', () => {
  assert.equal(estimateIndoorPAR(35, 0.7, 0.2), 19.6)
})

test('getHeatStressLevel applies accepted/warning/alarming zones correctly', () => {
  assert.equal(getHeatStressLevel(14, 18, 28, 14, 35), 'alarming')
  assert.equal(getHeatStressLevel(20, 18, 28, 14, 35), 'accepted')
  assert.equal(getHeatStressLevel(30, 18, 28, 14, 35), 'warning')
  assert.equal(getHeatStressLevel(35, 18, 28, 14, 35), 'alarming')
})

test('calculateRTR handles valid and divide-by-zero inputs', () => {
  assert.equal(calculateRTR(20, 17, 15, 'par'), 2)
  assert.equal(calculateRTR(20, 17, 0, 'par'), null)
})

test('calculateT24hFromTemps and rounding helpers are stable', () => {
  assert.equal(calculateT24hFromTemps(24, 16, 12, 0), 20)
  assert.equal(round(19.94, 1), 19.9)
  assert.equal(round(19.95, 1), 20)
  assert.equal(formatDarkPeriod(11.5), '11h 30m')
})

test('crop presets are internally consistent', () => {
  assert.ok(CROP_PRESETS.length >= 6)

  for (const crop of CROP_PRESETS) {
    assert.ok(crop.acceptedLow < crop.acceptedHigh, `${crop.id}: accepted range invalid`)
    assert.ok(crop.alarmLow < crop.acceptedLow, `${crop.id}: alarm low must be below accepted low`)
    assert.ok(crop.alarmHigh > crop.acceptedHigh, `${crop.id}: alarm high must be above accepted high`)
    assert.ok(crop.rtr > 0, `${crop.id}: RTR should be positive`)
  }
})
