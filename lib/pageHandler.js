const cheerio = require('cheerio')
const PageMatcher = require('./pageMatcher')

module.exports = class CheerioPageHandler {

  constructor (spider, host, path) {
    this.spider = spider
    this.pageMatcher = new PageMatcher({host, path})
  }

  handle (error, response, body) {
    const $ = cheerio.load(body)
    this.setBase(response.request.href)
    this.$ = $
    const matchedParams = this.pageMatcher.matches(response)
    if (matchedParams) {
      console.log('matched')
      this.extract($, matchedParams)
    }
    console.log('not matched')
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