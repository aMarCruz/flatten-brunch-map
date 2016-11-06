'use strict'

const SourceMapGenerator = require('source-map').SourceMapGenerator
const SourceMapConsumer  = require('source-map').SourceMapConsumer

function assertProperty (sourceMap, propertyName) {
  if (!sourceMap.hasOwnProperty(propertyName)) {
    const e = new Error(`Source map to be applied is missing the "${propertyName}" property`)
    throw e
  }
}

function transfer (fromSourceMap, toSourceMap, asString) {
  const smFrom    = new SourceMapConsumer(fromSourceMap)
  const smTo      = new SourceMapConsumer(toSourceMap)
  const smResult  = new SourceMapGenerator({
    file: fromSourceMap.file
  })

  smFrom.eachMapping(function (mapping) {
    const generatedPosition = {
      line: mapping.generatedLine,
      column: mapping.generatedColumn
    }
    const fromOriginalPosition = {
      line: mapping.originalLine,
      column: mapping.originalColumn
    }
    // from's generated position -> to's original position
    const originalPosition = smTo.originalPositionFor(fromOriginalPosition)

    if (originalPosition.source !== null) {
      smResult.addMapping({
        source: originalPosition.source,
        name : originalPosition.name,
        generated: generatedPosition,
        original: originalPosition
      })
    }
  })

  return asString ? smResult.toString() : smResult.toJSON()
}

/**
 * Return a re-mapped source map string
 *
 * @param   {object}       [sourceFile]  - The param received by the plugin
 * @param   {string}        compiled     - Processed or compiled code
 * @param   {object|string} sourceMap    - Generated source map
 * @returns {object} The resulting file object with flatten source map, if any.
 */
function flattenBrunchMap (sourceFile, compiled, sourceMap) {
  let asString = false
  let prevMap = sourceFile.map
  let newMap = sourceMap

  // make sure the current map is an object
  if (prevMap && (typeof prevMap == 'string' || prevMap instanceof String)) {
    prevMap = JSON.parse(prevMap)
  }

  // make sure the new map is an object
  if (newMap && (typeof newMap == 'string' || newMap instanceof String)) {
    newMap = JSON.parse(newMap)
    asString = true
  }

  const result = { data: compiled }

  if (newMap) {
    // check source map properties
    assertProperty(newMap, 'mappings')
    assertProperty(newMap, 'sources')

    // previous map?
    if (prevMap && prevMap.mappings) {

      if (!newMap.file && prevMap.file) {
        newMap.file = prevMap.file
      }
      result.map = transfer(newMap, prevMap, asString)

    } else {
      result.map = sourceMap
    }

  } else if (prevMap) {
    result.map = prevMap
  }

  return result
}

module.exports = flattenBrunchMap
