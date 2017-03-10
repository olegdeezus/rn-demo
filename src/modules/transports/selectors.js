export const getAllTransports = (state) => {
  return state.transports
}

export const getTransport = (state, id) => {
  return state.transports[id]
}

export const getTransportRoute = (state, id) => {
  return state.transports[id].route
}

export const getNextStop = (state, id) => {
  const { route } = state.transports[id]
  const nextStop = route.stops.filter(stop => {
    return stop.isNext
  })[0] || route.stops[0]

  return nextStop
}
