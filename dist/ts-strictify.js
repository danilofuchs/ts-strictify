'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.strictify = void 0
const git_1 = require('./lib/git')
const typescript_1 = require('./lib/typescript')
const path_1 = require('path')
const strictify = async (args) => {
  const { onFoundChangedFiles, onCheckFile, typeScriptOptions, gitOptions } = args
  const changedFiles = await git_1
    .findChangedFiles(gitOptions)
    .then((files) => files.filter((fileName) => Boolean(fileName.match(/\.tsx?$/))))
  onFoundChangedFiles(changedFiles)
  if (changedFiles.length === 0) {
    return { success: true, errors: 0 }
  }
  const tscOut = await typescript_1.compile(typeScriptOptions)
  const errorCount = changedFiles.reduce((totalErrorCount, fileName) => {
    let errorCount = 0
    tscOut.map((line) => {
      if (line.includes(path_1.relative(process.cwd(), fileName))) {
        errorCount === 0 ? onCheckFile(fileName, true) : null
        totalErrorCount++
        errorCount++
        console.log(line)
      }
    })
    errorCount === 0 ? onCheckFile(fileName, false) : null
    return totalErrorCount
  }, 0)
  return {
    success: errorCount === 0,
    errors: errorCount,
  }
}
exports.strictify = strictify
