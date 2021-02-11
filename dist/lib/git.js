'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.findChangedFiles = exports.findGitRootDir = void 0
const execa_1 = __importDefault(require('execa'))
const promise_1 = __importDefault(require('simple-git/promise'))
const lodash_1 = require('lodash')
const path_1 = require('path')
const findGitRootDir = async () => {
  return await execa_1
    .default('git', ['rev-parse', '--show-toplevel'])
    .then((resposne) => resposne.stdout)
    .catch(() => '')
}
exports.findGitRootDir = findGitRootDir
const findChangedFiles = async (options) => {
  const {
    untrackedFiles,
    modifiedFiles,
    createdFiles,
    stagedFiles,
    commitedFiles,
    targetBranch,
  } = options
  const status = await promise_1.default().status()
  const gitRootDir = await exports.findGitRootDir()
  const commited = await promise_1
    .default()
    .diff([`${targetBranch}...`, '--name-only'])
    .then((diff) => lodash_1.split(diff, '\n').filter((fileName) => !lodash_1.isEmpty(fileName)))
  return Array.from(
    new Set([
      ...(untrackedFiles ? status.not_added : []),
      ...(modifiedFiles ? status.modified : []),
      ...(createdFiles ? status.created : []),
      ...(stagedFiles ? status.staged : []),
      ...(commitedFiles ? commited : []),
    ]),
  ).map((fileName) => path_1.join(gitRootDir, fileName))
}
exports.findChangedFiles = findChangedFiles
