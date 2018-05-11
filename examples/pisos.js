const Spider = require('../lib')
const start = 'https://www.pisos.com/'
const CheerioPageHandler = require('../lib/pageHandler')

class PisosPageHandler extends CheerioPageHandler {
  extract($) {
    const $anchors = $('a')
    // $anchors.map(anchor => console.log($(anchor)))
    this.addUrls($anchors)
  }
}

const spider = new Spider()
spider.registerPageHandler(PisosPageHandler)
spider.addUrl(start)
spider.start()

