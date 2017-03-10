import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  Platform
} from 'react-native'
import Scene from './Scene'
import {
  GRAY_LIGHT,
  UNIT,
  GRAY_DARKER,
  GRAY_DARK,
  PRIMARY,
  BACKGROUND
} from '../style'

export default class BuyTicket extends React.Component {
  handleBlur = () => {
    this.transportId.blur()
  }

  render () {
    return <Scene style={styles.scene}>
      <Text
        style={styles.label}
      >
        Введите код-идентификатор автобуса
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={this.props.transportId}
          selectTextOnFocus
          // autoFocus
          underlineColorAndroid='transparent'
          onChangeText={this.props.onTransportId}
          ref={c => { this.transportId = c }}
          keyboardType='numeric'
          returnKeyType='next'
        />
      </View>
      <Text
        style={styles.label}
      >
        Количество билетов
      </Text>
      <View style={styles.counter}>
        { [1, 2, 3].map(i =>
          <Digit
            key={i}
            label={i}
            isActive={this.props.ticketsCount === i}
            onPress={() => this.props.onTicketsCount(i)}
          />
        )}
      </View>
      { this.props.isPending
        ? <ActivityIndicator style={styles.activityIndicator} />
        : <TouchableOpacity
          style={styles.done}
          onPress={this.props.onDone}
        >
          <Text style={styles.doneText}>
            Оплатить проезд
          </Text>
        </TouchableOpacity>
      }
      { !this.props.isOnline &&
        <Text
          style={styles.description}
        >
          Оплата проезда происходит путём звонка
          на специальный номер телефона с добавочным
          номером в виде кода-идентификатора автобуса.
          После звонка на мобильный телефон придет СМС
          от оператора для подтверждения оплаты
        </Text>
      }
      <KeyboardAvoidingView
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0 - 4 * UNIT - 1,
          right: 0
        }}
        behavior='padding'
        keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : -78}
      >
        <TouchableOpacity
          onPress={this.handleBlur}
          style={styles.blurContainer}
        >
          <Image
            source={require('../images/chevron-down.png')}
            style={styles.blurChevron}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Scene>
  }
}

const Digit = (props) =>
  <TouchableOpacity
    style={[
      styles.count,
      props.isActive && styles.countActive
    ]}
    onPress={props.onPress}
    activeOpacity={1}
  >
    <Text
      style={[
        styles.countText,
        props.isActive && styles.countTextActive
      ]}
      onPress={props.onPress}
    >
      {props.label}
    </Text>
  </TouchableOpacity>

const styles = StyleSheet.create({
  scene: {
    alignItems: 'center',
    paddingHorizontal: 2 * UNIT
  },
  activityIndicator: {
    margin: 4 * UNIT
  },
  inputWrapper: {
    borderColor: GRAY_LIGHT,
    borderBottomWidth: 1,
    margin: 8
  },
  input: {
    fontSize: 30,
    height: 40,
    width: 110,
    margin: 0,
    padding: 0,
    textAlign: 'center'
  },
  label: {
    margin: 2 * UNIT,
    fontSize: 2 * UNIT,
    textAlign: 'center',
    color: GRAY_DARKER
  },
  counter: {
    flexDirection: 'row'
  },
  count: {
    paddingVertical: UNIT,
    paddingHorizontal: 2 * UNIT
  },
  countText: {
    fontSize: 4 * UNIT,
    color: GRAY_LIGHT
  },
  countActive: {
    borderBottomWidth: 1
  },
  countTextActive: {
    color: GRAY_DARKER
  },
  done: {
    borderColor: PRIMARY,
    borderRadius: 6,
    borderWidth: 3,
    paddingVertical: 1.5 * UNIT,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2 * UNIT
  },
  doneText: {
    fontSize: 18,
    color: PRIMARY,
    fontWeight: 'bold'
  },
  description: {
    color: GRAY_DARK,
    textAlign: 'center'
  },
  blurContainer: {
    backgroundColor: BACKGROUND,
    borderColor: GRAY_DARK,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 2
  },
  blurChevron: {
    tintColor: GRAY_DARKER,
    margin: UNIT - StyleSheet.hairlineWidth
  }
})
