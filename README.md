[![npm Version][npm-image]][npm-url]
[![License][license-image]][license-url]

# flatten-brunch-map

Creates the object to return in a [Brunch](http://brunch.io) plugin, with an optional sourcemap, merged with the preceding sourcemap if necessary.

## Install

```bash
npm install flatten-brunch-map --save
```

## Usage

```js
const flattenMap = require('flatten-brunch-map')
...
const pluginResult = flattenMap(pluginParam, compiledCode, sourceMap)
```

## Example

```js
const flattenMap = require('flatten-brunch-map')
const myCompiler = require('myCompiler')

class MyPlugin {

  constructor (config) {
    this.options = config.plugins.myPlugin || {}

    // Say to myCompiler if user wants sourcemap
    this.options.sourceMaps = !!config.sourceMaps
  }

  compile (file) {
    try {
      // Do the plugin logic and then call flattenMap with the
      // received param and the generated code and sourcemap.
      const output = myCompiler(file.data, this.options)
      const result = flattenMap(file, output.code, output.map)

      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }

}

MyPlugin.prototype.brunchPlugin = true
MyPlugin.prototype.extension = 'js'
MyPlugin.prototype.type = 'javascript'

module.exports = MyPlugin
```

Like it? Don't forget your star.

[npm-image]:      https://img.shields.io/npm/v/flatten-brunch-map.svg
[npm-url]:        https://www.npmjs.com/package/flatten-brunch-map
[license-image]:  https://img.shields.io/npm/l/express.svg
[license-url]:    https://github.com/aMarCruz/flatten-brunch-map/blob/master/LICENSE
