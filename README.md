# Description

Converts from commonJS modules in node_modules to es6 module.
By default, creates file at [CURRENT_DIRECTOR]/node_modules/[MODULE]/bundle.js

## Usage

```javascript
const handleModules = require('es6-from-node-modules/index.js')
handleModules([
  'module1',
  'module2',
  ['module3', 'exportNameDifferentToModule3']
])
```