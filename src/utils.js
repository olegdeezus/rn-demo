import qs from 'qs'

function transformResponse (response) {
  if (
    typeof response.status === 'undefined' ||
    response.status < 200 ||
    response.status > 300
  ) {
    const err = {
      message: 'Ошибка сервера'
    }

    throw err
  }

  const handleResponse = (responseBody) => {
    if (responseBody.hasOwnProperty('error')) {
      throw responseBody.error
    }
    return responseBody
  }

  return response.json().then(handleResponse)
}

/**
 * HTTP GET request
 *
 * @param {string} uri - Requested URI
 * @param {Object} [payload] - Request payload
 */
export function get (uri, payload) {
  const query = qs.stringify(payload)

  return fetch(`${uri}?${query}`)
    .then(transformResponse)
}

/**
 * HTTP POST request
 *
 * @param {string} uri - Requested URI
 * @param {Object} [payload] - Request payload
 */
export function post (uri, payload) {
  return fetch(uri, {
    body: JSON.stringify(payload),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    method: 'POST'
  })
    .then(transformResponse)
}


/**
 * Returns promise that resolves after duration
 *
 * @param {number} [duration] - default: 10
 * @returns {promise}
 */
export function timeout (duration) {
  return new Promise(resolve => setTimeout(resolve, duration || 1))
}

/**
 * Verify is object path exist
 *
 * @param {Object} target - Verifiable object
 * @param {path} objectPath - path
 * @returns {boolean}
*/
export function isPathExists (target, objectPath) {
  if (!objectPath) return true
  let value = target

  return objectPath.split('.').every((key, index) => {
    value = value[key]

    return typeof value !== 'undefined'
  })
}
