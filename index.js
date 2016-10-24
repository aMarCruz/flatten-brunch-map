'use strict'

const SourceMapGenerator = require('source-map').SourceMapGenerator
const SourceMapConsumer  = require('source-map').SourceMapConsumer

function normalize (path) {
  return path && path.replace(/\\/g, '/')
}

function assertProperty (sourceMap, propertyName) {
  if (!sourceMap.hasOwnProperty(propertyName)) {
    const e = new Error(`Source map to be applied is missing the "${propertyName}" property`)
    throw e
  }
}

/**
 * @param   {object}       [sourceFile]  - The param received by the plugin
 * @param   {string}        compiled     - Processed or compiled code
 * @param   {object|string} sourceMap    - Generated source map
 * @returns {object} The resulting file object with flatten source map, if any.
 */
function flattenMap (sourceFile, compiled, sourceMap) {
  let fileName = sourceFile.path
  let prevMap  = sourceFile.map

  // make sure the current map is an object
  if (prevMap && (typeof prevMap == 'string' || prevMap instanceof String)) {
    prevMap = JSON.parse(prevMap)
  }

  // make sure the new map is an object
  if (sourceMap && typeof sourceMap == 'string' || sourceMap instanceof String) {
    sourceMap = JSON.parse(sourceMap)
  }

  const result = { data: compiled }

  if (sourceMap) {
    // check source map properties
    assertProperty(sourceMap, 'mappings')
    assertProperty(sourceMap, 'sources')

    // fix paths if Windows style paths
    sourceMap.file = normalize(sourceMap.file || fileName)
    sourceMap.sources = sourceMap.sources.map(normalize)

    if (prevMap && prevMap.mappings !== '') {
      const generator = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(sourceMap))

      generator.applySourceMap(new SourceMapConsumer(prevMap), normalize(fileName))
      sourceMap = JSON.parse(generator.toString())
    }

    result.map = sourceMap

  } else if (prevMap) {

    // seems that it is not neccesary
    result.map = prevMap
  }

  return result
}

module.exports = flattenMap
