const cheerio = require('cheerio')
const pageMatcher = require('./pageMatcher')

module.exports = class CheerioPageHandler {

  constructor (spider) {
    this.spider = spider
  }

  handle (error, response, body) {
    const $ = cheerio.load(body)
    this.setBase(response.request.href)
    this.$ = $
    const matchedParams = pageMatcher(response)
    if (matchedParams) {
      this.extract($)
    }
  }

  getBase () {
    return this.base
  }

  setBase (base) {
    this.base = base
  }

  addUrls (anchors) {
    const $ = this.$
    const urls = new Set()
    const base = this.getBase()
    $(anchors).each(function () {
      urls.add($(this).attr('href'))
    })
    urls.delete(undefined)
    for (let url of urls) {
      this.spider.addUrl(url, base)
    }
  }

  extract () {
    throw new Error('The execute method should be handled by a child class.')
  }

}