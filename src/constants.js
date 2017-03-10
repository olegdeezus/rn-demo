/**
 * Mobile number length
 */
export const MOBILE_NUMBER_LENGTH = 11

/**
 * Auth code length
 */
export const AUTH_CODE_LENGTH = 5

/**
 * ID card number length
 */
export const CARD_NUMBER_LENGTH = 6

/**
 * Max number of latest routes in store
 */
export const MAX_LATEST_ROUTES_LENGTH = 20

/**
 * Max distance to the beacon
 */
export const BEACON_MAX_DISTANCE = 15

/**
 * Transport type names
 */
export const TRANSPORT_TYPES = {
  bus: {
    icon: require('../images/transport-bus.png'),
    color: '#3983F4'
  },
  minibus: {
    icon: require('../images/transport-minibus.png'),
    color: '#FF971D'
  },
  tram: {
    icon: require('../images/transport-tram.png'),
    color: '#FFAAAA'
  },
  trolleybus: {
    icon: require('../images/transport-trolleybus.png'),
    color: '#18BA28'
  },
  walk: {
    icon: require('../images/transport-walk.png'),
    color: '#EAEAEA'
  }
}

/**
 * Max retries of requests
 */
export const MAX_RETRIES_COUNT = 5

/**
 * Timeout before request retry
 */
export const RETRY_TIMEOUT = 1000

/**
 * Polling timeout
 */
export const POLLING_INTERVAL = 2000

/**
 * Timeout before action retry (when status is not 'idle')
 */
export const ACTION_TIMEOUT = 50

/**
 * QR-code error correction level
 */
export const QR_LEVEL = 'H'

/**
 * Counter animation time
 */
export const COUNTER_ANIMATION_TIME = 2000

/**
 * Counter easing
 */
export const COUNTER_EASING = 'outExpo'

/**
 * Interval before old data disappears
 */
export const CLEAR_DATA_TIMEOUT = 500

/**
 * Beacons region UUID
 */
export const REGION_UUID = 'SOMEID'

/**
 * Beacons region identifier
 */
export const REGION_IDENTIFIER = 'Vezde'

/**
 * Far beacon distance
 */
export const BEACON_FAR_DISTANCE = 3

/**
 * Near beacon distance
 */
export const BEACON_NEAR_DISTANCE = 3

/**
 * Minimum beacons count
 */
export const MIN_BEACONS_COUNT = 1

/**
 * Beacon measurement period in milliseconds
 */
export const BEACON_MEASUREMENT_PERIOD = 20000

export const VIBRATION_TIME = 300

export const SUCCESS = 'SUCCESS'
export const IDLE = 'IDLE'
export const PENDING = 'PENDING'
export const FAILURE = 'FAILURE'
export const EDIT = 'EDIT'
export const DURING = 'DURING'

/**
 * API key for Google directions
 */
export const GOOGLE_DIRECTIONS_API_KEY = 'SOMEKEY'

/**
 * URI of Google Directions API
 */
export const GOOGLE_DIRECTIONS_API_URI = 'https://maps.googleapis.com/maps/api/directions/json'

/**
 * URI of Google Places autocomplete API
 */
export const GOOGLE_PLACES_AUTOCOMPLETE_API_URI = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'

/**
 * Mapbox API key
 */
export const MAPBOX_API_KEY = 'SOMEKEY'

export const API_URI = 'SOMEURI'

export const WEBSOCKET_URI = 'SOMEURI'

export const CARD_BINDING_REDIRECT_URI = 'SOMEURI'
