import React from 'react'
import { connect } from 'react-redux'
import MapScene from '../components/MapScene'
import { BLUE, GRAY_DARKER } from '../styles'
import * as transport from '../modules/transports'

class MapContainer extends React.Component {
  static defaultProps = {
    region: {
      center: {
        latitude: 59.9454,
        longitude: 30.3002
      }
    },
    steps: []
  }

  componentDidMount () {
    const region = {
      latitude: this.props.region.center.latitude,
      longitude: this.props.region.center.longitude,
      radius: 20
    }

    this.props.dispatch(transport.subscribeToPositions(region))
      .catch(error => {
        console.log(error)
      })
  }

  componentWillUnmount () {
    this.props.dispatch(transport.unsubscribeFromPositions())
  }

  render () {
    const {
      region,
      steps,
      startLocation,
      endLocation,
      transports
    } = this.props

    const route = steps.map(({ polyline, isWalking }, index) => ({
      coordinates: polyline,
      type: 'polyline',
      strokeColor: isWalking ? GRAY_DARKER : BLUE,
      strokeWidth: 4,
      id: `${index}`
    }))

    const startPoint = startLocation ? [{
      coordinates: [startLocation.latitude, startLocation.longitude],
      type: 'point',
      id: 'start'
    }] : []

    const endPoint = endLocation ? [{
      coordinates: [endLocation.latitude, endLocation.longitude],
      type: 'point',
      id: 'end'
    }] : []

    const transportPoints = filterTransports(transports)

    return <MapScene
      region={{
        ...this.props.region.center,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      }}
      transports={transportPoints}
      isInTrip
    />
  }
}

function filterTransports (transports) {
  if (!transports || !Object.keys(transports).length) {
    return []
  }

  return Object.keys(transports)
    .map(key => {
      const transport = transports[key]

      if (!transport.position) {
        return null
      }

      return {
        ...transport,
        coordinate: transport.position,
        id: `transport:${transport.id}`
      }
    })
    .filter(transport => transport)
}

const mapStateToProps = (state) => ({
  region: state.routes[0] && state.routes[0].region,
  steps: state.routes[0] && state.routes[0].steps,
  startLocation: state.routes[0] && state.routes[0].startLocation,
  endLocation: state.routes[0] && state.routes[0].endLocation,
  transports: transport.getAllTransports(state)
})

export default connect(mapStateToProps)(MapContainer)
