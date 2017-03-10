import types from './types'

export default function reducer (state = [], { type, payload }) {
  switch (type) {
    case types.FETCH: return payload.tickets
    case types.BUY: return [
      ...state,
      ...payload.tickets
    ]
    default: return state
  }
}
