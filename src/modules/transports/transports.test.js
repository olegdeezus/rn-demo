/* eslint-env jest */
import * as actions from './actions'
import reducer from './reducer'
import * as selectors from './selectors'
import * as transports from './index'
import socket from '../../socket'
import { timeout } from '../../utils'

jest.mock('../../socket')

describe('Transport module', () => {
  it('reduces empty action', () => {
    const action = { type: '' }
    expect(reducer({}, action)).toEqual({})
  })

  it('sets position', () => {
    const id = '1'
    const position = { latitude: 2, longitude: 2 }
    const initialState = {
      [id]: {
        id: id,
        path: [
          { latitude: 1, longitude: 1 }
        ]
      }
    }
    const action = actions.setPosition(id, position)
    const state = reducer(initialState, action)

    expect(state).toHaveProperty(id)
    expect(state[id].path).toHaveLength(2)
    expect(state[id].path[1]).toEqual(position)
  })

  it('set position to transport out of region', () => {
    const id = '1'
    const position = { latitude: 2, longitude: 2 }
    const action = actions.setPosition(id, position)
    const state = reducer(undefined, action)

    expect(state).toHaveProperty(id)
    expect(state[id].path).toHaveLength(1)
    expect(state[id].path[0]).toEqual(position)
  })

  it('add transport to list when it entering to region', () => {
    const transport = {
      id: '1',
      transportName: '123'
    }

    const action = actions.enterRegion(transport)
    const state = reducer(undefined, action)

    expect(state).toHaveProperty(transport.id)
  })

  it('remove transport from list when it leaving region', () => {
    const action = actions.leaveRegion('1')
    const state = reducer({
      '1': {
        id: '1'
      }
    }, action)

    expect(state).not.toHaveProperty('1')
  })

  it('get all transports list from state', () => {
    const state = {
      transports: {
        '1': { id: '1' },
        '2': { id: '2' }
      }
    }

    expect(selectors.getAllTransports(state)).toHaveProperty('1')
    expect(selectors.getAllTransports(state)).toHaveProperty('2')
  })

  it('get some transport from state', () => {
    const state = {
      transports: {
        '1': { id: '1' },
        '2': { id: '2' }
      }
    }

    expect(selectors.getTransport(state, 1)).toHaveProperty('id')
  })

  it('subscribe to positions', async () => {
    const { eventEmitters } = socket
    const region = { latitude: 1, longitude: 1, radius: 1 }
    const history = []
    const dispatch = ({ type }) => type && history.push(type)

    await transports.subscribeToPositions(region)(dispatch)
    await timeout()
    eventEmitters.transport_is_in_radius({ id: 1 })
    await timeout()
    eventEmitters.position({ coordinates: [ 2, 2 ] })
    await timeout()
    eventEmitters.transport_is_out_of_radius({ id: 1 })
    await timeout()
    eventEmitters.transport_is_in_radius({ id: 2 })
    await timeout()
    eventEmitters.transport_is_out_of_radius({ id: 2 })
    await transports.unsubscribeFromPositions()(dispatch)
    await timeout()

    expect(history).toEqual([
      actions.enterRegion().type,
      actions.setPosition().type,
      actions.leaveRegion().type,
      actions.enterRegion().type,
      actions.leaveRegion().type
    ])
  })

  it('subscribe to stop reached', async () => {
    const { eventEmitters } = socket
    const history = []
    const dispatch = ({ type }) => type && history.push(type)

    await transports.subscribeToStopReached(1)(dispatch)
    await timeout()
    await eventEmitters.bus_stop_reached({ id: 1 })
    await timeout()
    await transports.unsubscribeFromStopReached(1)(dispatch)
    await timeout()
    await eventEmitters.bus_stop_reached({ id: 1 })
    await timeout()

    expect(history).toEqual([
      actions.stopReached().type
    ])
  })

  it('get current transport route with stops', () => {
    const state = {
      transports: {
        1: {
          route: {
            1: {
              label: 'Stop label'
            }
          }
        }
      }
    }

    expect(selectors.getTransportRoute(state, 1)).toEqual({
      1: {
        label: 'Stop label'
      }
    })
  })

  it('set reached stop', () => {
    const initialState = {
      1: {
        id: 1,
        route: {
          1: { label: 'First stop' }
        }
      }
    }
    const action = actions.stopReached(1, 1)
    const state = reducer(initialState, action)

    expect(state[1].route[1]).toHaveProperty('isReached')
  })

  it('subscribe to next stop changed', async () => {
    const { eventEmitters } = socket
    const history = []
    const dispatch = ({ type }) => type && history.push(type)

    await transports.subscribeToNextStopChanged(1)(dispatch)
    await timeout()
    await eventEmitters.next_bus_stop_changed({ id: 1 })
    await timeout()
    await transports.unsubscribeFromNextStopChanged(1)(dispatch)
    await timeout()
    await eventEmitters.next_bus_stop_changed({ id: 1 })
    await timeout()

    expect(history).toEqual([
      actions.stopReached().type
    ])
  })

  it('set next stop', () => {
    const initialState = {
      1: {
        id: 1,
        route: {
          1: { label: 'First stop' }
        }
      }
    }
    const action = actions.setNextStop(1, 1)
    const state = reducer(initialState, action)

    expect(state[1].route[1]).toHaveProperty('isNext')
  })

  it.only('get next stop', () => {
    const state = {
      transports: {
        1: {
          route: {
            1: {
              label: 'Stop label',
              isNext: true
            }
          }
        }
      }
    }

    expect(selectors.getNextStop(state, 1)).toEqual({
      label: 'Stop label',
      isNext: true
    })
  })
})
