import * as actions from './actions'
import socket from '../../socket'

export const fetch = () => async dispatch => {
  const { tickets } = await socket.channels.passenger.push('get_tickets')
  const ticketsResult = []

  for (let ticket of tickets) {
    let [, ticketInfo] = await socket.join(`ticket:${ticket.id}`)

    ticketInfo.usages = await Promise.all(ticketInfo.usages.map(async usage => {
      let [, transport] = await socket.join(`transport:${usage.transport_id}`)

      return {
        ...usage,
        ...transport
      }
    }))

    ticketsResult.push(transformTicket(ticketInfo))
  }

  dispatch(actions.fetch(ticketsResult))
}

export const buy = (transportId, ticketsCount) => async dispatch => {
  const payload = {
    tickets_count: ticketsCount,
    behaviour: 'use_available_or_buy_and_use',
    transport: {
      bort_number: transportId.toString()
    },
    tarif_id: 1
  }

  const { tickets } = await socket.channels.passenger.push('buy_tickets', payload)

  const ticketsResult = []

  for (let ticket of tickets) {
    let [, ticketInfo] = await socket.join(`ticket:${ticket.id}`)

    ticketInfo.usages = await Promise.all(ticketInfo.usages.map(async usage => {
      let [, transport] = await socket.join(`transport:${usage.transport_id}`)

      return {
        ...usage,
        ...transport
      }
    }))

    ticketsResult.push(transformTicket(ticketInfo))
  }

  dispatch(actions.buy(ticketsResult))
}

function transformTicket (ticket) {
  return {
    id: ticket['id'],
    usagesCount: ticket['usages_count'],
    firstTimeUsedAt: ticket['first_time_used_at'],
    isClosed: ticket['is_closed'],
    isPayoutsCommitted: ticket['is_payouts_committed'],
    usages: ticket['usages'] && ticket['usages'].map(usage => ({
      bortNumber: usage['bort_number'],
      reiseId: usage['reise_id'],
      routeId: usage['route_id'],
      type: usage['transport_type'],
      routeName: usage['route_name'],
      transportId: usage['transport_id']
    }))
  }
}
