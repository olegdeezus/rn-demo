import * as actions from './actions'
import socket from '../../socket'
export * from './selectors'

/**
 * Subscribe to transport positions
 *
 * @param {object} region
 * @param {number} latitude Region center latitude
 * @param {number} longitude Region center longitude
 * @param {number} radius Region radius from center
 * @returns {promise}
 */
export const subscribeToPositions = (region) => async (dispatch) => {
  const payload = {
    lat: region.latitude,
    lon: region.longitude,
    radius: region.radius
  }

  const [ channel ] = await socket.join('transport:lobby')

  await channel.push('sub_transport_positions', payload)

  channel.on('transport_is_in_radius', async ({ id }) => {
    const [ transportChannel, transport ] = await socket.join(`transport:${id}`)

    if (!transport.route_id) return

    let route

    if (transport['route_id']) {
      route = await socket.channels.passenger.push('get_route', {
        route_id: transport['route_id']
      })
    }

    dispatch(actions.enterRegion({
      id,
      transportNumber: transport['bort_number'],
      licensePlate: transport['license_plate'],
      position: transport['position'] && {
        latitude: transport['position'][0],
        longitude: transport['position'][1]
      },
      path: [
        transport['position'] && {
          latitude: transport['position'][0],
          longitude: transport['position'][1]
        }
      ],
      route: route && transformRoute(route),
      routeId: transport['route_id'],
      companyId: transport['transport_company_id'],
      type: transport['transport_type']
    }))

    transportChannel.on('position', ({ coordinates }) => {
      dispatch(actions.setPosition(id, {
        latitude: coordinates[0],
        longitude: coordinates[1]
      }))
    })
  })

  channel.on('transport_is_out_of_radius', ({ id }) => {
    dispatch(actions.leaveRegion(id))
  })
}

export const unsubscribeFromPositions = () => (dispatch) => {
  return socket.channels['transport:lobby'].push('unsub_transport_positions')
}

/**
 * Start listening stop reached event
 *
 * @param {string} transportId - Transport identifier
 */
export const subscribeToStopReached = (transportId) => async (dispatch) => {
  const [ channel ] = await socket.join(`transport:${transportId}`)

  channel.on('bus_stop_reached', ({ id }) => {
    dispatch(actions.stopReached(transportId, id))
  })
}

/**
 * Stop listening stop reached event
 *
 * @param {string} transportId - Transport identifier
 */
export const unsubscribeFromStopReached = (transportId) => (dispatch) => {
  socket.channels[`transport:${transportId}`].on('bus_stop_reached', () => {})
}

/**
 * Start listening stop reached event
 *
 * @param {string} transportId - Transport identifier
 */
export const subscribeToNextStopChanged = (transportId) => async (dispatch) => {
  const [ channel ] = await socket.join(`transport:${transportId}`)

  channel.on('next_bus_stop_changed', ({ id }) => {
    dispatch(actions.stopReached(transportId, id))
  })
}

/**
 * Stop listening stop reached event
 *
 * @param {string} transportId - Transport identifier
 */
export const unsubscribeFromNextStopChanged = (transportId) => (dispatch) => {
  socket.channels[`transport:${transportId}`].on('next_bus_stop_changed', () => {})
}

const transformRoute = route => ({
  id: route.id,
  name: {
    full: route.full_name,
    short: route.short_name
  },
  transportType: route.transportType,
  stops: [
    ...route.direct_route_path.bus_stops.map(transformStop),
    ...route.reverse_route_path.bus_stops.map(transformStop)
  ]
})

const transformStop = stop => ({
  id: stop.id,
  name: stop.full_name,
  position: {
    latitude: stop.position.coordinates[0],
    longitude: stop.position.coordinates[1]
  }
})
