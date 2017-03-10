/* eslint-env jest */
import * as actions from './actions'
import reducer from './reducer'
import ticketsModule from './index'
import { timeout } from '../../utils'

jest.mock('../../socket')

const mockTicket = {
  id: 1,
  isClosed: true,
  isPayoutsCommitted: false,
  usagesCount: 1,
  firstTimeUsedAt: '2017-02-08T11:39:06.575975Z',
  usages: [{
    bortNumber: 1,
    reiseId: 1,
    routeId: 1,
    routeName: {
      full: 'full name',
      short: 'short name'
    },
    transportId: 1,
    type: 'BUS'
  }]
}

describe('Tickets module', () => {
  it('reduce empty action', () => {
    expect(reducer({}, { type: '' })).toEqual({})
  })

  it('fetch tickets list', async () => {
    let state
    const dispatch = action => {
      state = reducer(state, action)
    }

    await ticketsModule.fetch()(dispatch)
    await timeout()

    expect(state).toEqual([ mockTicket ])
  })

  it('get tickets list', () => {
    const state = { tickets: [
      { id: 1 }
    ]}

    expect(ticketsModule.getTickets(state)).toEqual([
      { id: 1 }
    ])
  })

  it('buy ticket', async () => {
    let state
    const dispatch = action => {
      state = reducer(state, action)
    }

    await ticketsModule.buy(1, 1)(dispatch)
    await timeout()

    expect(state).toEqual([ mockTicket ])
  })
})
