function parse() {
  const argv = process.argv.slice(2)
  const isAll = argv.some(ele => ele.includes('a'))
  const isList = argv.some(ele => ele.includes('l'))

  return {
    argv,
    isAll,
    isList
  }
}

module.exports = {
  parse
}