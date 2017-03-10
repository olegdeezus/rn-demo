import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  TRANSPORT_TYPES
} from '../constants'
import {
  UNIT,
  FONT_SIZE,
  GRAY,
  GRAY_LIGHTER,
  PRIMARY,
  BOLD_FONT,
  BACKGROUND
} from '../styles'

const Transport = props => {
  const {transportType, label} = props

  return (
    <View style={styles.transport}>
      <View style={[
        styles.transportIcon,
        {backgroundColor: TRANSPORT_TYPES[transportType].color}
      ]}>
        <Image
          source={TRANSPORT_TYPES[transportType].icon}
          style={[
            styles.transportImage,
            {tintColor: BACKGROUND}
          ]}
        />
      </View>
      <Text style={[
        styles.transportLabel,
        {color: TRANSPORT_TYPES[transportType].color}
      ]}>{label}</Text>
    </View>
  )
}

const InTrip = props => {
  const {
    transport,
    fare,
    nextBusStop,
    onComplete
  } = props

  let fareSymbol = (fare.currency === 'RUB') ? '₽' : ''

  return (
    <View style={styles.container}>
      <View style={styles.transportView}>
        <Transport
          transportType={transport.type}
          label={transport.label}
        />
        <Text style={styles.fareText}>
          {fare.amount} {fareSymbol}
        </Text>
        <TouchableOpacity
          style={styles.btnRouteEnd}
          onPress={onComplete}
        >
          <Text style={styles.btnRoundEndText}>
            Завершить
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.nextBusStopTitle}>
        Следующая остановка
      </Text>
      <Text style={styles.nextBusStopText}>
        {nextBusStop.label}
      </Text>
    </View>
  )
}

export default InTrip

const styles = StyleSheet.create({
  container: {
    padding: 2 * UNIT,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BACKGROUND
  },
  fareText: {
    fontSize: 1.5 * FONT_SIZE
  },
  btnRouteEnd: {
    paddingHorizontal: 2 * UNIT,
    paddingVertical: UNIT,
    borderRadius: UNIT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY_LIGHTER
  },
  btnRoundEndText: {
    fontSize: FONT_SIZE,
    color: PRIMARY
  },
  nextBusStopTitle: {
    color: GRAY,
    marginLeft: UNIT,
    fontSize: FONT_SIZE
  },
  nextBusStopText: {
    marginLeft: UNIT,
    fontSize: FONT_SIZE,
    fontWeight: BOLD_FONT
  },
  transportView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 1.5 * UNIT
  },
  transport: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  transportIcon: {
    width: 3 * UNIT,
    height: 3 * UNIT,
    borderRadius: 2 * UNIT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  transportImage: {
    width: 2.5 * UNIT
  },
  transportLabel: {
    fontSize: 1.5 * FONT_SIZE,
    marginLeft: UNIT
  }
})
