const path = require('path')
const fb = require('fast-glob')

function getFiles() {
  const files = fb.sync(
    ['**/*.js'],
    {
      cwd: path.resolve(process.cwd(), 'lib'),
      ignore: ['node_modules'],
      dot: true,
      absolute: true
    })

  return files
}

module.exports = {
  getFiles
}
