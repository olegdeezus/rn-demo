const eventEmitters = {}

/**
 * Assings received callback to appropriate event emitter
 */
const on = (event, cb) => {
  eventEmitters[event] = cb
}

const channels = {
  'transport:lobby': {
    push: async message => {},
    on
  },
  'transport:1': {
    on
  },
  'transport:2': {
    on
  },
  'passenger': {
    push: async message => ({
      get_tickets: { tickets: [
        {
          id: 1,
          is_closed: true,
          is_payouts_committed: false,
          usages_count: 1,
          first_time_used_at: '2017-02-08T11:39:06.575975Z'
        }
      ]},
      buy_tickets: [
        { id: 1 }
      ]
    }[message]),
    on
  }
}

const join = async channel => ([
  channels[channel],
  /**
   * This object contains mocked payload for channels, where
   * key is channel name and
   * value is payload
   * If channel not in list, it receive empty payload object
   */
  {
    'transport:1': {
      position: null,
      transport_id: 1,
      route_name: {
        full: 'full name',
        short: 'short name'
      },
      route_id: 1,
      transport_type: 'BUS'
    },
    'transport:2': { position: [ 2, 2 ] },
    'ticket:1': {
      id: 1,
      is_closed: true,
      is_payouts_committed: false,
      usages_count: 1,
      first_time_used_at: '2017-02-08T11:39:06.575975Z',
      usages: [
        { bort_number: 1, reise_id: 1, transport_id: 1 }
      ]
    }
  }[channel] || {}
])

export default {
  channels,
  join,
  eventEmitters
}
