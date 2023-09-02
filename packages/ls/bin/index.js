#!/usr/bin/env node

const fs = require('fs')
const { parse } = require('./parseArgs')
const { isAll, isList, argv } = parse()
const dir = process.cwd()
let files = fs.readdirSync(dir)
let out = ''

if (!isAll) {
  files = files.filter(ele => !ele.startsWith('.'))
}

files.forEach((ele, index, arr) => {
  out += ele + '\t' + (isList ? (index === arr.length - 1 ? '' : '\n') : '')
})

console.log(out)