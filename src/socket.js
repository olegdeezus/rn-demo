import { Socket } from 'phoenix-elixir'
import { WEBSOCKET_URI, RETRY_TIMEOUT } from './constants'
import 'js-base64'

class WebSocket {
  constructor () {
    this.isConnected = false
    this.channels = {
      passenger: {
        push: () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => reject('Нет соединения'), RETRY_TIMEOUT)
          })
        }
      }
    }
    this.channelListeners = {}
    this.token = null
    this.socket = null
  }

  /**
   * Connect to websocket server
   *
   * @param {string} token
   */
  connect (token) {
    return new Promise((resolve, reject) => {
      this.token = token

      // Create socket connection
      this.socket = createSocketConnection(token, WEBSOCKET_URI)
      this.isConnected = true

      const passengerId = parsePassengerId(token)
      const channelName = `passenger:${passengerId}`

      this.join(channelName)
        .then(result => {
          const [ passengerChannel, passenger ] = result
          this.channels.passenger = passengerChannel

          resolve(transformPassenger(passenger))
        })
        .catch(reject)
    })
  }

  /**
   * Join to channel, if not joined already.
   * If already joined, do nothing.
   *
   * @param {string} channelName
   */
  join (channelName) {
    return new Promise((resolve, reject) => {
      this.checkConnection()

      const channel = this.socket.channel(channelName)

      channel.join()
        .receive('ok', data => {
          // Wrap channel push method in promise
          if (!channel.hasOwnProperty('oldPush')) {
            channel.oldPush = channel.push
          }

          channel.push = (eventName, payload) => {
            return new Promise((resolve, reject) => {
              this.checkConnection()

              channel.oldPush(eventName, payload)
                .receive('ok', data => {
                  resolve(data)
                })
                .receive('error', reject)
                .receive('timeout', () => {
                  reject({ code: 1, message: 'Timeout', description: '' })
                })
            })
          }

          this.channels[channelName] = channel

          this.channelListeners[channelName] = {}

          resolve([channel, data])
        })
        .receive('error', reject)
        .receive('timeout', () => {
          reject({ code: 1, message: 'Timeout', description: '' })
        })
    })
  }

  listeners = {
    newBankCard: cb => {
      this.channels.passenger.on('new_bank_card', card => {
        cb(transformCard(card))
      })
    },
    cardBindingFailure: cb => {
      this.channels.passenger.on('bank_card_bind_failed', err => {
        const error = {
          code: err['RETURN_CODE'],
          message: err['RETURN_MESSAGE'],
          description: {
            'GW_ERROR_GENERIC_3D': 'В ходе обработки 3DS данных возникла ошибка',
            'GW_ERROR_GENERIC': 'В ходе обработки информации возникла ошибка. Пожалуйста, выполните операцию повторно',
            'GWERROR_-9': 'Ошибка в поле даты истечения срока действия карты',
            'GWERROR_-3': 'Позвоните в службу поддержки эквайера по соответствующему номеру',
            'GWERROR_-2': 'В ходе обработки информации возникла ошибка. Пожалуйста, выполните операцию повторно',
            'GWERROR_05': 'В авторизации отказано',
            'GWERROR_08': 'Неверная сумма',
            'GWERROR_13': 'Неверная сумма',
            'GWERROR_14': 'Такой карты не существует',
            'GWERROR_15': 'Такой карты/эмитента не существует',
            'GWERROR_19': 'Выполните повторный ввод данных операции',
            'GWERROR_34': 'Номер кредитной карты не принят: мошенничество',
            'GWERROR_41': 'Карта утеряна',
            'GWERROR_43': 'Карта украдена, перехват информации',
            'GWERROR_51': 'Недостаточно средств',
            'GWERROR_54': 'Срок действия карты истек',
            'GWERROR_57': 'Операция по данной карте не допускается',
            'GWERROR_58': 'Не допускается для ТСП',
            'GWERROR_61': 'Превышение лимита суммы',
            'GWERROR_62': 'Ограничение действия карты',
            'GWERROR_65': 'Превышение предела частоты',
            'GWERROR_75': 'Превышено количество попыток ввода PIN',
            'GWERROR_82': 'Время ожидания у эмитента истекло',
            'GWERROR_84': 'Недействительный проверочный код карты',
            'GWERROR_91': 'Техническая проблема. Обработка данных эмитентом невозможна.',
            'GWERROR_96': 'Сбой в работе системы',
            'GWERROR_2204': 'Отсутствие разрешения на проводку частичного платежа по карте.',
            'GWERROR_2304': 'Ваш заказ в настоящее время обрабатывается.',
            'GWERROR_5007 ': 'Для дебетовых карт реализована поддержка лишь операций 3D.',
            'ALREADY_AUTHORIZED': 'Платеж уже авторизован',
            'NEW_ERROR': 'Ошибка передачи сообщений. Например, может означать, что сервер PayU получил от банка сообщение, для которого нет стандартного кода. Подробности можно узнать у службы поддержки (integration@payu.ru)',
            'WRONG_ERROR': 'Выполните повторный ввод данных операции',
            '-9999': 'Запрещенная операция',
            '1': 'Позвоните в службу поддержки эквайера',
            'GWERROR_-19': 'Аутентификация не выполнена'
          }[err['RETURN_CODE']] || err['RETURN_MESSAGE']
        }

        cb(error)
      })
    },
    newTicket: cb => {
      this.channels.passenger.on('ticket_bought', ticket => {
        cb(transformTicket(ticket))
      })
    }
  }

  /**
   * Generate new value for qr-code
   *
   * @param {number} tariffId
   */
  codeGenerate (tariffId) {
    return this.channels.passenger.push('generate_identity_code', {
      preffered_tarid_id: tariffId
    })
  }

  metricSend (metric) {
    return this.channels.passenger.push('send_metric', metric)
  }

  cardBind (card) {
    return new Promise((resolve, reject) => {
      this.channels.passenger.push('create_bank_card_bind_order_request', card)
        .then(response => {
          resolve({
            urlRedirect: response['url_redirect']
          })
        })
        .catch(reject)
    })
  }

  cardsFetch () {
    return new Promise((resolve, reject) => {
      this.channels.passenger.push('get_bank_cards')
        .then(response => {
          const card = transformCard(response)

          resolve(card)
        })
        .catch(reject)
    })
  }

  ticketsFetch () {
    return new Promise((resolve, reject) => {
      this.channels.passenger.push('get_tickets')
        .then(response => {
          const newTickets = response.tickets.map(transformTicket)

          return resolve(newTickets)
        })
        .catch(reject)
    })
  }

  ticketBuy (transportId, ticketsCount) {
    const payload = {
      tickets_count: ticketsCount,
      behaviour: 'use_available_or_buy_and_use',
      transport: {
        bort_number: transportId.toString()
      },
      tarif_id: 1
    }

    return this.channels.passenger.push('buy_tickets', payload)
  }

  tariffListFetch () {
    return this.channels.passenger.push('get_tarif_list')
  }

  checkConnection () {
    if (!this.isConnected) {
      throw new Error('Not connected')
    }
  }

  /**
   * Update user info
   *
   * @param {string} name First name
   * @param {string} lastname Last name
   * @param {string} email
   */
  userInfoUpdate (name, lastname, email) {
    return this.channels.passenger.push('update_info', { name, lastname, email })
  }
}

export default new WebSocket()

function transformCard (card) {
  return {
    id: card['id'],
    token: card['token'],
    tokenExpireAt: card['token_expire_at'],
    tokenStatus: card['token_status'],
    cardExpireAt: card['card_expire_at'],
    bank: card['bank'],
    holderName: card['holder_name'],
    numberMask: card['number_mask'],
    type: card['type'],
    programName: card['program_name']
  }
}

function transformTicket (ticket) {
  return {
    id: ticket['id'],
    usagesCount: ticket['usages_count'],
    firstTimeUsedAt: ticket['first_time_used_at'],
    isClosed: ticket['is_closed'],
    isPayoutsCommitted: ticket['is_payouts_committed']
  }
}

/**
 * Transform passenger data received from server to local object format
 *
 * @param {Object} passengerData
 */
function transformPassenger (passengerData) {
  return {
    balance: passengerData['balance'],
    bankCards: passengerData['bank_cards'].map(transformCard),
    nfcCards: passengerData['nfc_cards']
  }
}

/**
 * Parses passenger id value from received token
 * @param {string} token
 */
function parsePassengerId (token) {
  const decodedToken = window.Base64.decode(token)

  const regex = /passenger:([0-9]*)/

  return decodedToken.match(regex)[1]
}

/**
 * Create socket connection
 * @param {string} token
 * @param {string} uri WebSocket uri
 */
function createSocketConnection (token, uri) {
  const socket = new Socket(uri, {params: { token }})

  socket.connect()

  return socket
}
