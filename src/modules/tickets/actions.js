import types from './types'

export const fetch = tickets => ({
  type: types.FETCH,
  payload: { tickets }
})

export const buy = tickets => ({
  type: types.BUY,
  payload: { tickets }
})
