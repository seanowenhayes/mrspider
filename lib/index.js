const { URL } = require('url')
const downloader = require('./downloader')()

const DEFAULT_POLITENESS = 1000

function executePageHandlers(error, response, body) {
  this.pageHandlers.forEach(handler => handler.handle(error, response, body))
}

module.exports = class Spider {

  constructor({ politeness = DEFAULT_POLITENESS } = {}) {
    this.urls = []
    this.pageHandlers = []
    this.politeness = politeness
    this.waitingFor = 0
  }

  addUrl(path, base) {
    this.urls.push(new URL(path, base))
  }

  registerPageHandler(PageHandler, host, path) {
    this.pageHandlers.push(new PageHandler(this, host, path))
  }

  crawl() {
    const url = this.urls.pop()
    if (url) {
      this.waitingFor++
        downloader(url.href, (error, response, body) => {
          executePageHandlers.bind(this)(error, response, body)
          this.waitingFor--
        })
    }
    else if (!this.waitingFor) {
      clearInterval(this.timerID)
    }
  }

  start() {
    this.timerID = setInterval(() => {
      this.crawl()
    }, this.politeness)
  }
}
