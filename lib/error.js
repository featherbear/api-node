const CATEGORY_CODE_MAP = {
  50: 'Elvanto::Unauthorized:',
  100: 'Elvanto::Unauthorized:',
  102: 'Elvanto::Unauthorized:',
  250: 'Elvanto::BadRequest:'
}

const HTTP_STATUS_CODES = {
  401: 'Elvanto::Unauthorized:',
  400: 'Elvanto::BadRequest:',
  404: 'Elvanto::NotFound:',
  500: 'Elvanto::InternalError:'
}

let ERROR_CODES = { ...CATEGORY_CODE_MAP, ...HTTP_STATUS_CODES }

// <overview> Throws an exception if response has bad status code </overview>
const discoverError = function (code) {
  if (ERROR_CODES[code]) {
    throw new Error(ERROR_CODES[code])
  }
}

module.exports = discoverError
