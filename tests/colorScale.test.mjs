import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getContrastTextColor,
  getHeatmapColor,
  getZoneLabel,
} from '../.test-build/colorScale.js'

const acceptedLow = 18
const acceptedHigh = 28
const alarmLow = 14
const alarmHigh = 35

test('getHeatmapColor returns expected endpoint colors at alarm limits', () => {
  assert.equal(getHeatmapColor(14, acceptedLow, acceptedHigh, alarmLow, alarmHigh), '#2196f3')
  assert.equal(getHeatmapColor(35, acceptedLow, acceptedHigh, alarmLow, alarmHigh), '#b71c1c')
})

test('getHeatmapColor returns accepted green inside the accepted range', () => {
  assert.equal(getHeatmapColor(18, acceptedLow, acceptedHigh, alarmLow, alarmHigh), '#4caf50')
  assert.equal(getHeatmapColor(23, acceptedLow, acceptedHigh, alarmLow, alarmHigh), '#4caf50')
})

test('getContrastTextColor chooses readable foregrounds', () => {
  assert.equal(getContrastTextColor('#2196f3'), '#FFFFFF')
  assert.equal(getContrastTextColor('#ffeb3b'), '#333333')
})

test('getZoneLabel follows accepted/warning/alarm thresholds', () => {
  assert.equal(getZoneLabel(13, acceptedLow, acceptedHigh, alarmLow, alarmHigh), 'Alarming')
  assert.equal(getZoneLabel(17, acceptedLow, acceptedHigh, alarmLow, alarmHigh), 'Warning')
  assert.equal(getZoneLabel(22, acceptedLow, acceptedHigh, alarmLow, alarmHigh), 'Accepted')
  assert.equal(getZoneLabel(36, acceptedLow, acceptedHigh, alarmLow, alarmHigh), 'Alarming')
})
