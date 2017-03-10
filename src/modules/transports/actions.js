import * as types from './types'

export const setPosition = (id, position) => ({
  type: types.SET_POSITION,
  payload: { id, position }
})

export const enterRegion = transport => ({
  type: types.ENTER_REGION,
  payload: { transport }
})

export const leaveRegion = id => ({
  type: types.LEAVE_REGION,
  payload: { id }
})

export const stopReached = (transportId, stopId) => ({
  type: types.STOP_REACHED,
  payload: { transportId, stopId }
})

export const setNextStop = (transportId, stopId) => ({
  type: types.SET_NEXT_STOP,
  payload: { transportId, stopId }
})
