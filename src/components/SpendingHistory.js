import React from 'react'
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native'
import { TRANSPORT_TYPES } from '../constants'
import {
  UNIT,
  GRAY_LIGHT,
  GRAY,
  FONT_SIZE
} from '../style'
import Scene from './Scene'
import moment from 'moment'

moment.updateLocale('ru', require('moment/locale/ru'))

class MenuGroup extends React.Component {
  styles = StyleSheet.create({
    headerView: {
      backgroundColor: '#ededed',
      padding: 5
    },
    headerText: {
      fontSize: FONT_SIZE,
      color: '#a7a7a7'
    },
    content: {
      backgroundColor: 'white'
    }
  })

  render () {
    const {children, title} = this.props
    return (
      <View style={this.styles.menuGroupView}>
        <View style={this.styles.headerView}>
          <Text style={this.styles.headerText}>{title}</Text>
        </View>
        <View style={this.styles.content}>
          {children}
        </View>
      </View>
    )
  }
}

class SpendingItem extends React.Component {
  styles = StyleSheet.create({
    spendingItemView: {
      backgroundColor: 'white',
      padding: 2 * UNIT,
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderColor: GRAY_LIGHT,
      borderBottomWidth: 1,
      alignItems: 'center'
    },
    labelView: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    labelTimeText: {
      fontSize: FONT_SIZE,
      color: GRAY
    },
    labelTrasportText: {
      fontSize: FONT_SIZE,
      fontWeight: 'bold',
      marginLeft: UNIT / 2
    },
    countText: {
      fontSize: FONT_SIZE,
      fontWeight: 'bold',
      color: GRAY,
      marginLeft: UNIT
    },
    amountText: {
      fontSize: FONT_SIZE,
      fontWeight: 'bold'
    },
    imageTransport: {
      width: 3 * UNIT,
      height: 3 * UNIT,
      marginLeft: 2 * UNIT
    }
  })

  render () {
    const { spending } = this.props
    let transport = TRANSPORT_TYPES[spending.typeTransport]

    return (
      <View style={this.styles.spendingItemView}>
        <View style={this.styles.labelView}>
          <Text style={this.styles.labelTimeText}>{moment(spending.time).format('HH:mm')}</Text>
          <Image style={[this.styles.imageTransport, {tintColor: transport.color}]} source={transport.icon} />
          <Text style={[this.styles.labelTrasportText, {color: transport.color}]}>{spending.labelTransport}</Text>
          { spending.count > 1 &&
          <Text style={this.styles.countText}>x{spending.count}</Text>
          }
        </View>
        <View>
          <Text style={this.styles.amountText}>- {spending.amount} {spending.currency}</Text>
        </View>
      </View>
    )
  }
}

class DataGroup extends React.Component {
  getSpendings = (data) => {
    return data.map(function (element, index) {
      return <SpendingItem spending={element} key={index} />
    })
  }

  render () {
    const {dataGroup, datetime} = this.props

    return (
      <MenuGroup title={moment(datetime).format('DD MMMM, YYYY')}>
        {this.getSpendings(dataGroup)}
      </MenuGroup>
    )
  }
}

export default class SpendingHistory extends React.Component {
  getDataGroup = (data) => {
    return data.map(function (element, index) {
      return <DataGroup dataGroup={element.spending} datetime={element.datetime} key={index} />
    })
  }

  render () {
    return (
      <Scene>
        <ScrollView>
          {this.getDataGroup(this.props.spendingItems)}
        </ScrollView>
      </Scene>
    )
  }
}

SpendingHistory.propTypes = {
  spendingItems: React.PropTypes.array
}
