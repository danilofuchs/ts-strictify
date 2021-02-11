'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.compile = exports.isFlagSupported = void 0
const execa_1 = __importDefault(require('execa'))
const isFlagSupported = (flag, helpOutput) => {
  return helpOutput.includes(flag)
}
exports.isFlagSupported = isFlagSupported
const compile = async (options) => {
  let flagSupported = () => true
  try {
    const { all: helpOutput } = await execa_1.default('tsc', ['--help'], {
      all: true,
      preferLocal: true,
    })
    if (helpOutput !== undefined) {
      flagSupported = (flag) => exports.isFlagSupported(flag, helpOutput)
    }
  } catch (error) {
    // hope we are on a recent tsc
  }
  const args = Object.entries(options)
    .map(([key, value]) => [key.replace(/^/, '--'), value])
    .filter(([key, _value]) => flagSupported(key))
    .reduce((result, [key, value]) => [...result, key, value], [])
  let tscOutput = []
  try {
    await execa_1.default('tsc', args, { all: true, preferLocal: true })
  } catch (error) {
    const { all } = error
    tscOutput = all.split('\n')
  }
  return tscOutput
}
exports.compile = compile
