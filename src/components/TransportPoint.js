import React from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform
} from 'react-native'
import MapView from 'react-native-maps'
import {
  BACKGROUND,
  RADIUS,
  FOREGROUND,
  UNIT
} from '../styles'
import {
  TRANSPORT_TYPES
} from '../constants'

const TransportPoint = props => (
  <MapView.Marker
    coordinate={props.coordinate}
    identifier={props.identifier}
    anchor={{
      x: 0.5,
      y: 0.5
    }}
    title={props.title || ''}
  >
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {props.routeId || ''}
        </Text>
      </View>
      { Platform.OS === 'ios'
        ? <Image
          source={require('../images/transport-point.png')}
          style={styles.pin}
        >
          <Image
            source={TRANSPORT_TYPES[props.type.toLowerCase()].icon}
            style={styles.icon}
          />
        </Image>
        : <View style={styles.androidMarker} />
      }
    </View>
  </MapView.Marker>
)

export default TransportPoint

const styles = StyleSheet.create({
  container: {
    height: 4 * UNIT,
    overflow: 'visible'
  },
  labelContainer: {
    backgroundColor: BACKGROUND,
    borderRadius: RADIUS,
    height: 2.5 * UNIT,
    padding: 0.5 * UNIT,
    paddingLeft: 1.25 * UNIT,
    marginLeft: 1.5 * UNIT
  },
  label: {
    color: FOREGROUND,
    fontSize: 1.5 * UNIT
  },
  pin: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center'
  },
  androidMarker: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    transform: [{ 'rotateZ': '45deg' }],
    backgroundColor: 'blue'
  },
  icon: {
    tintColor: BACKGROUND,
    marginTop: -2
  }
})
