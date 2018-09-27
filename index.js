const {plugin} = require('postcss')
const {relative} = require('path')
const {readFileSync, writeFileSync} = require('fs')
module.exports = plugin('postcss-timings', function (opts) {
  opts.file = opts.file || 'timings'
  const start = Date.now()
  return (root, result) => {
    const path = relative(process.cwd(), result.opts.from)
    let timings
    try {
      timings = readFileSync(opts.file, 'utf-8')
        .split('\n')
        .map(line => line.split(' '))
        .filter(([time, file]) => file !== path)
    } catch (e) {
      timings = []
    }
    timings.push([Date.now() - start, path])
    timings = timings.map(line => line.join(' ')).join('\n')
    writeFileSync(opts.file, timings, 'utf-8')
  }
})
