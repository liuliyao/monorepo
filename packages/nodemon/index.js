const startServer = require('./lib/startServer')
const { underlineToHumpObject, humpToUnderlineObject } = require('@sfe/helper')

startServer.start()

console.log('--underlineToHumpObject--', underlineToHumpObject({ user_info: 100 }))
console.log('--humpToUnderlineObject--', humpToUnderlineObject({ userInfo: 100 }))