import React from 'react'
import Tickets from '../components/Tickets'
import { connect } from 'react-redux'
import tickets from '../modules/tickets'
import code from '../modules/code'
import tariff from '../modules/tariff'
import { tariffListFetch } from '../actions/tariffActions'
import {
  getCode,
  getTariffList
} from '../selectors'

class TicketsContainer extends React.Component {
  state = {
    currentTariffId: 1,
    tariffList: null,
    error: null
  }

  componentDidMount () {
    Promise.all([
      this.props.dispatch(tickets.fetch()),
      this.props.dispatch(tickets.fetch())
    ])
      .catch(error => {
        this.setState({ error })
      })
  }

  componentWillReceiveProps ({ tariffList, code }) {
    const { currentTariffId } = this.state

    if (code === null) {
      this.props.dispatch(code.fetch(currentTariffId))
        .catch(error => {
          this.setState({ error })
        })
    }

    this.setState({
      // @TODO: This is potential buggy place, cause we transform tariff list
      //        each time, when component receive props. This may affect
      //        performance
      tariffList: transformTariffList(tariffList, currentTariffId)
    })
  }

  onTariffChange = (currentTariffId) => {
    this.setState({ currentTariffId })
    this.props.dispatch(code.fetch(currentTariffId))
      .catch(error => {
        this.setState({ error })
      })
  }

  render () {
    return <Tickets
      code={this.props.code ? this.props.code.value : ''}
      tickets={transformTickets(filterTickets(this.props.tickets))}
      tariffList={this.props.tariff.fetchList}
      onTariffChange={this.onTariffChange}
    />
  }
}

function filterTickets (tickets) {
  if (!tickets) {
    return []
  }

  return tickets.filter(ticket => !ticket.isClosed)
}

function transformTickets (tickets) {
  if (!tickets) {
    return []
  }

  return tickets.map(ticket => ({
    transportType: ticket.transport.type,
    label: ticket.transport.label,
    type: ticket.type,
    count: ticket.usagesCount
  }))
}

const mapStateToProps = (state) => ({
  code: code.getCode(state),
  tickets: tickets.getTickets(state),
  tariffList: tariff.getTariffList(state)
})

/**
 * Add to each tariff boolean property 'isCurrent', which means this is current
 * using tariff or not
 *
 * @param {array} tariffList
 * @param {number} currentTariffId
 */
function transformTariffList (tariffList, currentTariffId) {
  if (!tariffList || !tariffList.length) return tariffList

  return tariffList.map(tariff => ({
    ...tariff,
    isCurrent: tariff.id === currentTariffId
  }))
}

export default connect(mapStateToProps)(TicketsContainer)
