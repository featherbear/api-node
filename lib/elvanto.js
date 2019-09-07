// Asynchronous Node.js wrapper for Elvanto API.

const client = require('./client.js')
const querystring = require('querystring')

// @params [String] clientId The Client ID of your registered OAuth application.
// @params [String] redirectUri The Redirect URI of your registered OAuth application.
// @params [String] scope
// @params [String] state Optional state data to be included in the URL.
// @return [String] The authorization URL to which users of your application should be redirected.
const authorizeUrl = function (clientId, redirectUri, scope, state) {
  if (typeof clientId === 'undefined') throw new Error('clientId is required')
  if (typeof redirectUri === 'undefined') throw new Error('redirectUri is required')

  if (scope instanceof Array) {
    scope = scope.join()
  }

  let params = {
    type: 'web_server',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope
  }

  if (state) {
    params['state'] = state
  }

  let url = `https://${client.config['host']}/oauth?${querystring.stringify(params)}`

  return url
}

// @params [String] clientId The Client ID of your registered OAuth application.
// @param [String] clientSecret The Client Secret of your registered OAuth application.
// @param [String] code The unique OAuth code to be exchanged for an access token.
// @param [String] redirectUrl The Redirect URI of your registered OAuth application.
// @return [Object] {access_token: accessToken, expiresIn, refreshToken}
const exchangeToken = function (clientId, clientSecret, code, redirectUri) {
  if (typeof clientId === 'undefined') throw new Error('clientId is required')
  if (typeof clientSecret === 'undefined') throw new Error('clientSecret is required')
  if (typeof code === 'undefined') throw new Error('code is required')
  if (typeof redirectUri === 'undefined') throw new Error('redirectUri is required')

  let data = {
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri
  }

  return client.retrieveTokens(data)
}

// @param [String] refreshToken Was included when the original token was granted to automatically retrieve a new access token.
// @return [Object] {access_token: accessToken, expiresIn, refreshToken}
const refreshToken = function (refreshToken) {
  if (typeof refreshToken === 'undefined') {
    throw new Error('No refresh token given')
  }

  let data = { grant_type: 'refresh_token', refresh_token: refreshToken }

  return client.retrieveTokens(data)
}

module.exports = {
  Client: client.Client,
  authorizeUrl,
  exchangeToken,
  refreshToken
}
