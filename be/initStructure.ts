import fs from 'fs'
import path from 'path'

function replaceAll(string: string, name: string) {
  return string.replace(/ControllerName/g, `${name}Controller`)
    .replace(/InterfaceName/g, `I${name}`)
    .replace(/ServiceName/g, `${name}Service`)
    .replace(/ModelName/g, `${name}s`)
    .replace(/RouterName/g, `${name}Router`)
    .replace(/modelsName/g, `${name.toLowerCase()}s`)
}

const structure = {
  controller: fs.readFileSync(path.join(__dirname, 'sampleStructure', 'controller'), { encoding: 'utf-8' }),
  interface: fs.readFileSync(path.join(__dirname, 'sampleStructure', 'interface'), { encoding: 'utf-8' }),
  model: fs.readFileSync(path.join(__dirname, 'sampleStructure', 'model'), { encoding: 'utf-8' }),
  router: fs.readFileSync(path.join(__dirname, 'sampleStructure', 'router'), { encoding: 'utf-8' }),
  service: fs.readFileSync(path.join(__dirname, 'sampleStructure', 'service'), { encoding: 'utf-8' }),
  name: ''
}
process.argv.forEach(o => {
  if (o.includes('--name=')) {
    structure.name = o.replace('--name=', '')
  }
})

structure.controller = replaceAll(structure.controller, structure.name)
structure.interface = replaceAll(structure.interface, structure.name)
structure.model = replaceAll(structure.model, structure.name)
structure.model = replaceAll(structure.model, structure.name)
structure.router = replaceAll(structure.router, structure.name)
structure.service = replaceAll(structure.service, structure.name)

function addToIndex(currentIndex: string, name: string, type: 'controller' | 'service' | 'model' | 'interface' | 'router') {
  if (type === 'controller') {
    currentIndex += `export {default as ${name}Controller} from './${name}Controller' \n`
  }

  if (type === 'model') {
    currentIndex += `export {default as ${name}s} from './${name}s' \n`
  }

  if (type === 'interface') {
    currentIndex += `export {default as I${name}} from './I${name}' \n`
  }

  if (type === 'service') {
    currentIndex += `export {default as ${name}Service} from './${name}Service' \n`
  }

  if (type === 'router') {
  }
  return currentIndex
}

fs.writeFileSync(path.join(__dirname, 'src', 'controllers', `${structure.name}Controller.ts`), structure.controller)
fs.writeFileSync(
  path.join(__dirname, 'src', 'controllers', `index.ts`),
  addToIndex(
    fs.readFileSync(path.join(__dirname, 'src', 'controllers', 'index.ts'), { encoding: 'utf-8' }),
    structure.name,
    'controller'
  )
)

fs.writeFileSync(path.join(__dirname, 'src', 'models', `${structure.name}s.ts`), structure.model)
fs.writeFileSync(
  path.join(__dirname, 'src', 'models', `index.ts`),
  addToIndex(
    fs.readFileSync(path.join(__dirname, 'src', 'models', 'index.ts'), { encoding: 'utf-8' }),
    structure.name,
    'model'
  )
)

//interface 
fs.writeFileSync(path.join(__dirname, 'src', 'interfaces', `I${structure.name}.ts`), structure.interface)
fs.writeFileSync(
  path.join(__dirname, 'src', 'interfaces', `index.ts`),
  addToIndex(
    fs.readFileSync(path.join(__dirname, 'src', 'interfaces', 'index.ts'), { encoding: 'utf-8' }),
    structure.name,
    'interface'
  )
)

//router
if (!fs.existSync(path.join(__dirname, 'src', 'routers', `${structure.name}Router`))) {
  fs.mkdirSync(path.join(__dirname, 'src', 'routers', `${structure.name}Router`))
}
fs.writeFileSync(path.join(__dirname, 'src', 'routers', `${structure.name}Router`, `${structure.name}Router.ts`), structure.router)
fs.writeFileSync(path.join(__dirname, 'src', 'routers', `${structure.name}Router`, "index.ts"), `import ${`${structure.name}Router`} from "./${`${structure.name}Router`}";\nexport default ${`${structure.name}Router`}`)
fs.writeFileSync(
  path.join(__dirname, 'src', 'routers', `index.ts`),
  addToIndex(
    fs.readFileSync(path.join(__dirname, 'src', 'routers', 'index.ts'), { encoding: 'utf-8' }),
    structure.name,
    'router'
  )
)

//service
if (!fs.existSync(path.join(__dirname, 'src', 'services', `${structure.name}Service`))) {
  fs.mkdirSync(path.join(__dirname, 'src', 'services', `${structure.name}Service`)
}
fs.writeFileSync(path.join(__dirname, 'src', 'services', `${structure.name}Service`, "index.ts"), `import ${`${structure.name}Service`} from "./${`${structure.name}Service`}";\nexport default ${`${structure.name}Service`}`)

fs.writeFileSync(path.join(__dirname, 'src', 'services', `${structure.name}Service`, `I${structure.name}Service.ts`), '')

fs.writeFileSync(path.join(__dirname, 'src', 'services', `${structure.name}Service`, `${structure.name}Service.ts`), structure.service)
fs.writeFileSync(
  path.join(__dirname, 'src', 'services', `index.ts`),
  addToIndex(
    fs.readFileSync(path.join(__dirname, 'src', 'services', 'index.ts'), { encoding: 'utf-8' }),
    structure.name,
    'service'
  )
)