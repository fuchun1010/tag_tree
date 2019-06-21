const hashCode = (str) => {
  var h = 0, l = s.length, i = 0
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0
  return h
}

const initErrorMessage = (msg, code = 500) => {
  return {
    message: msg,
    customCode: code
  }
}

module.exports = {
  initErrorMessage,
  hashCode
}