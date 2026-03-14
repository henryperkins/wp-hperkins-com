# `resolve-file-extension`

Resolve an absolute file path from a base filename.

## Example

For example, this can be used to emulate the legacy Node.js "automatic" module resolution behavior you may be familiar with, where a file extension can be optionally omitted for specific file extensions such as `.js` and `.json`.

```js
import { getFilePath } from 'resolve-file-extension';

await getFilePath('./example', ['.js', '.json']);
// "/path/to/example.js"
```

## Installation

Install using [npm](https://www.npmjs.com/):

```
npm install resolve-file-extension
```

## API

### `getFilePath(baseFile: string, extension?: string[]): Promise<string|undefined>`

Given a base file name and optional file extensions constraint, returns a promise which resolves to the first file path matching that base name and extension, or undefined if no file could be found. Extensions should be provided with a leading dot (".").

## License

Copyright 2021 Andrew Duthie

Released under the [MIT License](./LICENSE.md).
