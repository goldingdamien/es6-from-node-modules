const browserify = require('browserify')
const path = require('path')
const fs = require('fs-extra')

/**
 * Runs browserify on node_modules module and returns bundlePath
 * @param {String} moduleName
 * @param {string} exportedModuleName
 * @return {Promise} resolves bundle path
 */
async function browserifyModule(moduleName, exportedModuleName){
  if(!exportedModuleName){
    exportedModuleName = moduleName
  }
  const b = browserify()
  const modulePath = path.resolve('node_modules', moduleName)
  const packageJSONPath = path.resolve(modulePath, 'package.json')
  const packageJson = await fs.readJSON(packageJSONPath)
  const entryFilePath = path.resolve(modulePath, packageJson.main)
  const bundlePath = path.resolve(modulePath, 'bundle.js')
  
  const stream = fs.createWriteStream(bundlePath)
  return new Promise(resolve => {
    stream.on('finish', ()=>{
      console.log('browserify complete for', moduleName)
      resolve(bundlePath)
    })

    const b = browserify({
      standalone: exportedModuleName
    })
    b.add(entryFilePath)
    b.bundle()
    .pipe(stream)
  })
}

async function handleModule(moduleName, exportedModuleName){
  if(!exportedModuleName){
    exportedModuleName = moduleName
  }
  const bundlePath = await browserifyModule(moduleName, exportedModuleName)
  const code = await fs.readFile(bundlePath, {encoding: 'utf8'})
  const es6ModuleCode = scriptToES6Module(code, exportedModuleName)
  await fs.writeFile(bundlePath, es6ModuleCode)
  console.log('module end', moduleName)
}

function handleModules(moduleOptionsArray = []){
  const promises = moduleOptionsArray.map(moduleOptions => {
    if(!Array.isArray(moduleOptions)){
      moduleOptions = [moduleOptions]
    }

    return handleModule(...moduleOptions)
  })
  return Promise.all(promises)
}

function scriptToES6Module (code = '', varName) {
  return `${code}
  export default window['${varName}']`
}

module.exports = handleModules