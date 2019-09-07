const discoverError = require('./error.js')
const querystring = require('querystring')
const fetch = require('node-fetch')

const config = {
  host: 'api.elvanto.com'
}

class Client {
  constructor (authData = {}) {
    this.auth = null
    this.options = {
      headers: {
        Accept: 'application/json'
      }
    }

    this.configure(authData)
  }

  // @params [Object] params.
  // When using OAuth authentication it is {accessToken: "accessToken"}
  // When using an API key it is {apiKey: "apiKey"}
  configure ({ accessToken, apiKey }) {
    if (accessToken) {
      this.auth = { accessToken }
      this.options['headers']['Authorization'] = `Bearer ${accessToken}`
    } else if (apiKey) {
      this.auth = { apiKey }
      let B64auth = Buffer.from(`${apiKey}:x`).toString('base64')
      this.options['headers']['Authorization'] = `Basic ${B64auth}`
    }

    return this
  }

  // @param [String] endPoint for example: "people/getAll" or "groups/GetInfo"
  // @param [Object] option List of parameters
  // @return [Object] response body
  apiCall (endPoint, data) {
    if (!this.auth) {
      throw new Error(
        'Not configured - Please provide an access token or an API key'
      )
    }

    let headers = { 'Content-Type': 'application/json' }

    return post(
      `https://${config.host}/v1/${endPoint}.json`,
      JSON.stringify(data || {}),
      { ...this.options['headers'], headers }
    )
  }
}

// <overview> Retrieve tokens </overview>
// @param [Object] data
// @return [Object] {access_token, expires_in, refresh_token}
let retrieveTokens = function (data) {
  let headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

  return post(
    `https://${config.host}/oauth/token`,
    querystring.stringify(data || {}),
    headers
  )
}

const post = function (path, data, headers) {
  return fetch(path, {
    method: 'POST',
    body: data,
    headers
  }).then(response =>
    response.json().then(json => {
      try {
        discoverError(response.status, json)
      } catch (err) {
        throw err
      }
    })
  )
}

module.exports = {
  Client,
  config,
  retrieveTokens
}
