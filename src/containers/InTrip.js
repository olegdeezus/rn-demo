import React from 'react'
import InTrip from '../components/InTrip'
import { connect } from 'react-redux'
import * as transports from '../modules/transports'
import tickets from '../modules/tickets'

class InTripContainer extends React.Component {
  state = {
    isInTrip: false,
    mountedAt: new Date()
  }

  onComplete = () => {
    this.setState({ mountedAt: new Date() })
  }

  render () {
    const { currentTicket } = this.props
    if (!currentTicket) return null

    const { mountedAt } = this.state
    const ticketTime = new Date(currentTicket.firstTimeUsedAt)

    if (mountedAt > ticketTime) return null

    const { nextStop } = this.props
    const transport = currentTicket.transport

    return <InTrip
      nextBusStop={{
        label: nextStop.name
      }}
      transport={{
        type: transport.type.toLowerCase(),
        label: transport.routeName.short
      }}
      fare={{
        currency: 'RUB',
        amount: 30
      }}
      onComplete={this.onComplete}
    />
  }
}

const mapStateToProps = state => {
  const ticketsList = tickets.getTickets(state)
  const currentTicket = ticketsList[ticketsList.length - 1]

  if (!currentTicket) return { currentTicket }

  const transport = currentTicket.transport
  const { transportId } = transport

  return {
    nextStop: transports.getNextStop(state, transportId),
    currentTicket
  }
}

export default connect(mapStateToProps)(InTripContainer)
