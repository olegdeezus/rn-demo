import React from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
  Text
  TouchableOpacity
} from 'react-native'
import {
  BACKGROUND,
  FOREGROUND,
  SECONDARY,
  FONT_SIZE,
  UNIT,
  GRAY,
  GRAY_DARK,
  GRAY_DARKER,
  GRAY_LIGHT,
  BOLD_FONT,
  RADIUS,
  MEDIUM_FONT
} from '../styles'
import {
  TRANSPORT_TYPES
} from '../constants'
import Scene from '../Scene'
import Qr from 'react-native-qrcode'

const Tariff = ({ label, onPress, isCurrent, style }) => (
  <TouchableOpacity
    style={[
      styles.tariff,
      style,
      isCurrent ? styles.tariffCurrent : null
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.tariffLabel,
      isCurrent && styles.tariffLabelCurrent
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
)

const TariffSwitch = ({ tariffList, defaultTariff, onChange }) => (
  <View style={styles.tariffSwitch}>
    { tariffList && tariffList.length
      ? tariffList.map((tariff, index) => (
        <Tariff
          {...tariff}
          onPress={() => onChange(tariff.id)}
          style={[
            (index === 0) && {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0
            },
            (index === tariffList.length - 1) && {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0
            }
          ]}
          key={index}
        />
      ))
      : <Text style={styles.tariffDefault}>Тариф: {defaultTariff}</Text>
    }
  </View>
)

const Ticket = ({ transportType, label, type, count }) => (
  <View style={styles.ticket}>
    <Image
      source={TRANSPORT_TYPES[transportType].icon}
      style={[
        styles.ticketTransportType,
        {tintColor: TRANSPORT_TYPES[transportType].color}
      ]}
    />
    <View style={styles.spacer} />
    <Text style={styles.ticketType}>{type}</Text>
    <Text style={styles.ticketCount}>×{count || 1}</Text>
    <Image
      source={require('../images/chevron-right.png')}
      style={styles.chevron}
    />
  </View>
)

const Section = ({ title, children, style, ...restProps }) => (
  <View style={[ styles.section, style ]}>
    { title && (
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>{title.toUpperCase()}</Text>
      </View>
    ) }
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
)

const QrCode = ({ code }) => (
  <View style={styles.qrCodeWrapper}>
    { code
      ? <Qr
        value={code}
        size={18 * UNIT}
        bgColor={FOREGROUND}
        fgColor={BACKGROUND}
      />
      : <ActivityIndicator />
    }
  </View>
)

const Tickets = ({ code, tickets, tariffList, onChangeTariff }) => (
  <Scene style={styles.scene}>
    <View style={styles.title}>
      <Text style={styles.titleText}>Код-идентификатор</Text>
    </View>
    <Section style={{minHeight: 20 * UNIT}}>
      <QrCode code={code} />
      <TariffSwitch
        onChange={onChangeTariff}
        tariffList={tariffList}
        defaultTariff='Единый'
      />
    </Section>
    <Section title='Доступные билеты'>
      <ScrollView style={styles.ticketsList}>
        { tickets
          ? tickets.length
          ? tickets.map((ticket, index) => <Ticket {...ticket} key={index} />)
            : <Text style={styles.ticketsEmpty}>Нет доступных билетов</Text>
          : <ActivityIndicator />
        }
      </ScrollView>
    </Section>
  </Scene>
)

export default class extends React.Component {
  render () {
    return <Tickets {...this.props} />
  }
}

const styles = StyleSheet.create({
  scene: {
    marginTop: Platform.OS === 'ios' ? 12 : 0
  },
  title: {
    height: UNIT * 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: GRAY_LIGHT
  },
  titleText: {
    fontSize: 2.5 * UNIT,
    fontWeight: BOLD_FONT,
    color: GRAY_DARKER
  },
  section: {
    flexGrow: 1
  },
  sectionContent: {
    justifyContent: 'center',
    flex: 1
  },
  sectionTitle: {
    backgroundColor: GRAY_LIGHT,
    padding: 2 * UNIT,
    paddingBottom: 0.5 * UNIT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: GRAY
  },
  sectionTitleText: {
    color: GRAY_DARK
  },
  qrCodeWrapper: {
    width: 18 * UNIT,
    height: 18 * UNIT,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 2 * UNIT
  },
  ticketsEmpty: {
    color: GRAY,
    marginTop: 2 * UNIT,
    alignSelf: 'center'
  },
  ticket: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2 * UNIT,
    borderColor: GRAY,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  ticketCount: {
    fontWeight: MEDIUM_FONT,
    fontSize: FONT_SIZE * 1.25,
    marginLeft: 3 * UNIT
  },
  ticketType: {
    color: GRAY_DARK
  },
  ticketTransportType: {
    width: 4 * UNIT,
    marginLeft: 0 - 0.5 * UNIT
  },
  ticketLabel: {
    fontWeight: BOLD_FONT
  },
  tariffSwitch: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    margin: 2 * UNIT
  },
  tariff: {
    borderColor: SECONDARY,
    borderWidth: 1,
    borderRadius: RADIUS,
    padding: UNIT
  },
  tariffCurrent: {
    backgroundColor: SECONDARY
  },
  tariffLabel: {
    color: SECONDARY
  },
  tariffLabelCurrent: {
    color: BACKGROUND
  },
  spacer: {
    flex: 1
  },
  chevron: {
    tintColor: GRAY,
    marginLeft: 2 * UNIT
  }
})
