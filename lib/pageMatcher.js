// @flow
const pathMatch = require('path-match')

module.exports = class PathMatcher {

  constructor ({host, path}) {
    this.host = host
    this.path = pathMatch({
      // path-to-regexp options
      sensitive: false,
      strict: false,
      end: false,
    })(path)
  }

  matches (response) {
    const {host, path} = response.request
    return this.host === host && this.path(path)
  }

}
