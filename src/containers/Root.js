import React from 'react'
import {
  StyleSheet,
  Platform,
  Alert
} from 'react-native'
import {
  BACKGROUND,
  GRAY,
  UNIT
} from '../constants/styleConstants'
import { connect } from 'react-redux'
import token from '../modules/auth'
import { socketConnect } from '../actions/socketActions'
import { metricSend } from '../actions/metricActions'
import { cardAdd } from '../actions/cardsActions'
import { codeLoad } from '../actions/codeActions'
import tickets from '../modules/tickets'
import {
  netStatusSubscribe,
  netStatusUnsubscribe
} from '../actions/deviceActions'
import {
  Router,
  Scene,
  Modal,
  Actions,
  Switch
} from 'react-native-router-flux'
import TabIcon from '../components/TabIcon'
import MapScene from './MapScene'
import Tickets from './Tickets'
// import TripPlanning from './TripPlanning'
import BuyTicket from './BuyTicket'
import AddCard from './AddCard'

class Root extends React.Component {
  state = {
    scene: 'map'
  }

  componentDidMount () {
    this.props.dispatch(netStatus.subscribe())

    if (this.props.isStateLoaded && this.props.token) {
      this.connect(this.props.token)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { token } = nextProps

    if (this.props.token !== token && token) {
      this.connect(token)
    }
  }

  componentWillUnmount () {
    this.props.dispatch(netStatus.unsubscribe())
  }

  connect (token) {
    this.props.dispatch(socket.connect(token))
      .then(socket => {
        if (!socket) throw new Error()
        this.props.dispatch(metric.send())
        this.props.dispatch(tickets.fetch())
        socket.listeners.newBankCard(card => {
          this.props.dispatch(card.add(card))
            .then(() => {
              Alert.alert(
                'Карта привязана',
                `Номер карты ${card.numberMask}`
              )
            })
        })
        socket.listeners.cardBindingFailure(error => {
          Alert.alert(
            'Ошибка привязки карты',
            error.description
          )
        })
      })
      .catch(() => {
        this.props.dispatch(auth.logout())
      })
  }

  render () {
    if (!this.props.isStateLoaded) {
      return null
    }

    return <Router>
      <Scene key='modal' component={Modal} >
        <Scene
          key='main'
          component={connect(state => ({ isLoggedIn: getIsLoggedIn(state) }))(Switch)}
          tabs
          unmountScenes
          selector={props => props.isLoggedIn ? 'root' : 'auth'}
        >
          <Scene
            key='auth'
            navigationBarStyle={style.navBar}
            backButtonImage={require('../images/chevron-left.png')}
          >
            <Scene
              key='authMobileNumber'
              component={AuthMobileNumber}
              rightTitle=' '
              onRight={() => {}}
            />
            <Scene
              key='authCode'
              component={AuthCode}
              onBack={() => Actions.pop({ refresh: { editMode: true } })}
            />
            <Scene
              key='authAddCard'
              component={AddCard}
              title='Добавить карту'
              rightTitle='Добавить'
              onRight={() => {}}
            />
          </Scene>
          <Scene
            key='root'
            tabs
            tabBarStyle={style.tabBar}
            tabBarIconContainerStyle={style.tabBarIconContainer}
            initial={this.props.isLoggedIn}
            pressOpacity={1}
          >
            <Scene
              key='profile'
              title='Профиль'
              icon={TabIcon}
              navigationBarStyle={style.navBar}
              backButtonImage={require('../images/chevron-left.png')}
            >
              <Scene
                key='profileMenu'
                component={Profile}
                initial
                title='Профиль'
                renderBackButton={() => (null)}
              />
              <Scene
                key='addCard'
                component={AddCard}
                title='Добавить карту'
                rightTitle='Добавить'
                onRight={() => undefined}
              />
              <Scene
                key='bankCards'
                component={BankCards}
                title='Банк. карты'
                rightTitle='Добавить'
                onRight={() => Actions.addCard()}
              />
              <Scene
                key='notifications'
                component={Notifications}
                title='Уведомления'
              />
              <Scene
                key='spendingHistory'
                component={SpendingHistory}
                title='История расходов'
              />
              <Scene
                key='familyAccess'
                component={FamilyAccess}
                title='Семейный доступ'
              />
              <Scene
                key='idDevices'
                component={IdDevices}
                title='Устройства'
              />
              <Scene
                key='city'
                component={City}
                title='Город'
              />
              <Scene
                key='language'
                component={Language}
                title='Язык интерфейса'
              />
              <Scene
                key='supportChat'
                component={SupportChat}
                title='Помощь'
              />
              <Scene
                key='editProfile'
                component={EditProfile}
                title='Редактировать'
                rightTitle='Готово'
                onRight={() => {}}
              />
            </Scene>
            <Scene
              key='map'
              component={MapScene}
              initial
              title='Карта'
              icon={TabIcon}
              onPress={Actions.mapScene}
              hideNavBar
            />
            <Scene
              key='buyTicket'
              component={BuyTicket}
              title='Оплатить'
              icon={TabIcon}
              hideNavBar
            />
            <Scene
              key='qr'
              component={Tickets}
              onPress={() => {
                this.props.codeLoad()
                Actions.qr()
              }}
              title='Билеты'
              icon={TabIcon}
              hideNavBar
              rightButtonImage={require('../images/plus.png')}
              onRight={() => Actions.addCard()}
            />
          </Scene>
        </Scene>
      </Scene>
    </Router>
  }
}

const mapStateToProps = state => ({
  isStateLoaded: state.isStateLoaded,
  isLoggedIn: !!state.token,
  token: state.token
})


export default connect(mapStateToProps)(Root)

const style = StyleSheet.create({
  tabBar: {
    backgroundColor: BACKGROUND,
    flexDirection: 'row',
    borderColor: 'whitesmoke',
    borderTopWidth: 1,
    height: 8 * UNIT,
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  tabBarIconContainer: {
    height: 8 * UNIT
  },
  navBar: {
    height: (Platform.OS === 'ios') ? 64 : 54,
    backgroundColor: BACKGROUND,
    borderBottomColor: GRAY
  }
})
