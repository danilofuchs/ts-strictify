#!/usr/bin/env node
'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const chalk_1 = __importDefault(require('chalk'))
const yargs_1 = __importDefault(require('yargs'))
const lodash_1 = require('lodash')
const ts_strictify_1 = require('./ts-strictify')
const run = async () => {
  const argv = yargs_1.default
    .options({
      noImplicitAny: { type: 'boolean', default: true },
      noImplicitThis: { type: 'boolean', default: true },
      noImplicitUseStrict: { type: 'boolean', default: false },
      alwaysStrict: { type: 'boolean', default: true },
      strictBindCallApply: { type: 'boolean', default: true },
      strictNullChecks: { type: 'boolean', default: true },
      strictFunctionTypes: { type: 'boolean', default: true },
      strictPropertyInitialization: { type: 'boolean', default: true },
      noUncheckedIndexedAccess: { type: 'boolean', default: true },
      noEmit: { type: 'boolean', default: true },
      targetBranch: { type: 'string', default: 'master' },
      commitedFiles: { type: 'boolean', default: true },
      stagedFiles: { type: 'boolean', default: true },
      modifiedFiles: { type: 'boolean', default: true },
      untrackedFiles: { type: 'boolean', default: true },
      createdFiles: { type: 'boolean', default: true },
    })
    .parserConfiguration({
      'strip-dashed': true,
    }).argv
  const typeScriptOptions = lodash_1.pick(argv, [
    'noImplicitAny',
    'noImplicitThis',
    'noImplicitUseStrict',
    'alwaysStrict',
    'strictBindCallApply',
    'strictNullChecks',
    'strictFunctionTypes',
    'strictPropertyInitialization',
    'noUncheckedIndexedAccess',
    'noEmit',
  ])
  const gitOptions = lodash_1.pick(argv, [
    'commitedFiles',
    'stagedFiles',
    'modifiedFiles',
    'untrackedFiles',
    'createdFiles',
    'targetBranch',
  ])
  const result = await ts_strictify_1.strictify({
    gitOptions,
    typeScriptOptions,
    onFoundChangedFiles: (changedFiles) => {
      console.log(
        `🎯  Found ${chalk_1.default.bold(String(changedFiles.length))} changed ${
          changedFiles.length === 1 ? 'file' : 'files'
        }`,
      )
    },
    onExamineFile: (file) => {
      console.log(`🔍  Checking ${chalk_1.default.bold(file)} ...`)
    },
    onCheckFile: (file, hasError) =>
      hasError
        ? console.log(`❌  ${chalk_1.default.bold(file)} failed`)
        : console.log(`✅  ${chalk_1.default.bold(file)} passed`),
  })
  if (result.errors) {
    console.log(`💥  ${result.errors} errors found`)
    process.exit(1)
  } else {
    console.log(`🎉  ${chalk_1.default.green('All files passed')}`)
  }
}
run()
