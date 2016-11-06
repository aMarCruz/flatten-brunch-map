[![npm Version][npm-image]][npm-url]
[![License][license-image]][license-url]

# flatten-brunch-map

Creates the object to return in a [Brunch](http://brunch.io) plugin, with an optional sourcemap, merged with the preceding sourcemap if necessary.

**IMPORTANT:**

v2.8.1 have a breaking change, please read the [What's New](#whats-new) section.

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
    return new Promise((resolve, reject) => {
      try {
        // Do the plugin logic and then call flattenMap with the
        // received param and the generated code and sourcemap.
        const output = myCompiler(file.data, this.options)
        const result = flattenMap(file, output.code, output.map)

        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

}

MyPlugin.prototype.brunchPlugin = true
MyPlugin.prototype.extension = 'js'
MyPlugin.prototype.type = 'javascript'

module.exports = MyPlugin
```


## What's New

From v2.8.1, the plugin does not depend on filename.

Normalization of file names that were made in previous versions (conversion of `\` to `/`) no longer occurs and the names are transferred as-is.

Also from v2.8.1, the format of the `map` property of the returned object is the same as that received in the 3rd parameter. That is, if an object is received, an object is returned instead of a JSON string.

This helps compatibility between different tools, but the caller must ensure consistency of the filenames.


---
Like it? Don't forget your star.

[npm-image]:      https://img.shields.io/npm/v/flatten-brunch-map.svg
[npm-url]:        https://www.npmjs.com/package/flatten-brunch-map
[license-image]:  https://img.shields.io/npm/l/express.svg
[license-url]:    https://github.com/aMarCruz/flatten-brunch-map/blob/master/LICENSE
