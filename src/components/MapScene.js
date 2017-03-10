import React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import MapView from 'react-native-maps'
import InTrip from '../containers/InTrip'
import {
  UNIT
} from '../style'
import TransportPoint from './TransportPoint'

const MapScene = props => (
  <View style={styles.container}>
    <MapView
      style={styles.map}
      initialRegion={props.region}
      provider='google'
      showsUserLocation
      showsMyLocationButton
      showsBuildings
      toolbarEnabled={false}
    >
      {props.transports.map(transport => (
        <TransportPoint {...transport} key={transport.id} />
      ))}
    </MapView>
    { props.isInTrip && <InTrip />}
  </View>
)

export default MapScene

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8 * UNIT
  },
  map: {
    flex: 1,
    marginBottom: -30
  }
})
