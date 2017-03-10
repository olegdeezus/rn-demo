import React from 'react'
import { connect } from 'react-redux'
import SpendingHistory from '../components/SpendingHistory'
import tickets from '../modules/tickets'

class SpendingHistoryContainer extends React.Component {
  render () {
    return <SpendingHistory
      spendingItems={groupTicketsByDate(transformTickets(this.props.tickets))}
    />
  }
}

function transformTickets (tickets) {
  return tickets.map(ticket => ({
    typeSpending: 'ticket',
    count: ticket.usages.lenght,
    currency: ticket.fare.currency,
    amount: ticket.fare.amount,
    typeTransport: ticket.transport.type,
    labelTransport: ticket.transport.label,
    time: ticket.firstTimeUsedAt && new Date(ticket.firstTimeUsedAt)
  }))
}

function groupTicketsByDate (tickets) {
  const dates = {}

  for (let ticket of tickets) {
    if (!ticket.time) continue

    const year = ticket.time.getFullYear()
    const month = `0${ticket.time.getMonth() + 1}`.slice(-2)
    const day = `0${ticket.time.getDate()}`.slice(-2)

    const ticketDateTime = [year, month, day].join('')

    dates[ticketDateTime] = [
      ...dates[ticketDateTime] || [],
      ticket
    ]
  }

  const groups = Object.keys(dates).map(datetime => ({
    datetime,
    spending: dates[datetime]
  })).reverse()

  return groups
}

const mapStateToProps = state => ({
  tickets: tickets.getTickets(state)
})

export default connect(mapStateToProps)(SpendingHistoryContainer)
