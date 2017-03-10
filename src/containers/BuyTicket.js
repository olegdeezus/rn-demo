import React from 'react'
import {
  Alert
} from 'react-native'
import BuyTicket from '../components/BuyTicket'
import Communications from 'react-native-communications'
import { connect } from 'react-redux'
import city from '../modules/city'
import { Actions } from 'react-native-router-flux'
import tickets from '../modules/tickets'

class BuyTicketContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      transportId: '',
      ticketsCount: 1,
      isPending: false,
      callPhoneNumber: props.callPhoneNumber
    }
  }

  componentDidMount () {
    Actions.refresh({ onRight: this.handleDone })
  }

  handleTransportId = (transportId) => {
    this.setState({ transportId })
  }

  handleTicketsCount = (ticketsCount) => {
    this.setState({ ticketsCount: ticketsCount })
  }

  handleDone = () => {
    const {
      transportId,
      ticketsCount,
      payPhoneNumber
    } = this.state
    const phoneNumber = `${payPhoneNumber},${transportId}*${ticketsCount}`

    if (this.props.isOnline) {
      this.setState({ isPending: true })
      this.props.dispatch(tickets.buy(transportId, ticketsCount))
        .then(() => {
          this.setState({ isPending: false })
          Actions.map()
        })
        .catch(error => {
          this.setState({ isPending: false })

          Alert.alert(
            'Ошибка',
            error.desccription
          )
        })
    } else {
      Communications.phonecall(phoneNumber, true)
    }
  }

  render () {
    return <BuyTicket
      transportId={this.state.transportId}
      onTransportId={this.handleTransportId}
      ticketsCount={this.state.ticketsCount}
      onTicketsCount={this.handleTicketsCount}
      onDone={this.handleDone}
      error={this.state.error}
      isPending={this.state.isPending}
      isOnline={this.props.isOnline}
    />
  }
}

const mapStateToProps = state => ({
  payPhoneNumber: city.getPayPhoneNumber(state),
  isOnline: state.isOnline
})

export default connect(mapStateToProps)(BuyTicketContainer)
