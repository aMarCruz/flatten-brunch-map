# flatten-brunch-map Changes

### 2018-10-14 - v2.10.0

- Update devDependencies
- Minimum node.js version is 6
- Avoid throw when sourceMap mappings is an empty string (because empty code)

### 2017-02-01 - v2.8.2

- Try to normalize the new source map.
- The `sources` property defaults to the received file path.

### 2016-11-06 - v2.8.1

- Rewrite to not depend on filename, now the plugin does not normalizes file names.
- The format of `map` in the returned object matches the received format.

This helps compatibility between different tools, but the caller must ensure consistency of the filenames.

### 2016-10-24 - v2.8.0

- Initial release.
