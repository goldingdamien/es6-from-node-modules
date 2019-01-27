const handleModules = require('../index.js')

async function build(){
  await handleModules([
    ['js-classes', 'jsClasses'],
    'mustache'
  ])
  console.log('build complete')
}
try{
build().then(()=>{})
}catch(error){
  console.error(error)
}