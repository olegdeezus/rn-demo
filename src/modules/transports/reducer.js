import * as types from './types'
import { isPathExists } from '../../utils'

const initialState = {}

export default function reducer (state = initialState, { type, payload }) {
  switch (type) {
    case types.SET_POSITION: {
      if (!state[payload.id]) return state

      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          path: [
            ...state[payload.id].path,
            payload.position
          ]
        }
      }
    }
    case types.ENTER_REGION: return {
      ...state,
      [payload.transport.id]: payload.transport
    }
    case types.LEAVE_REGION: {
      const newState = { ...state }

      delete newState[payload.id]

      return newState
    }
    case types.STOP_REACHED: {
      const { transportId, stopId } = payload
      const nextState = { ...state }

      if (isPathExists(nextState, `${transportId}.route.stops.${stopId}`)) {
        nextState[transportId]['route'].stops[stopId].isReached = true
      }

      return nextState
    }
    case types.SET_NEXT_STOP: {
      const { transportId, stopId } = payload
      const nextState = { ...state }

      console.log(nextState)
      if (isPathExists(nextState, `${transportId}.route.stops.${stopId}`)) {
        nextState[transportId]['route'].stops[stopId].isNext = true
      }

      return nextState
    }
    default: return state
  }
}
