import fs from 'fs'
import { IWorld } from 'interfaces'
import { DefaultBuildings, DefaultResources, DefaultUnits, DefaultUnitTypes } from 'models'
import DefaultUpgrade from 'models/DefaultUpgrades'
import path from 'path'
const buildings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'defaultData', 'building.json')) as unknown as string)
const units = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'defaultData', 'units.json')) as unknown as string)

const resources = [
  {
    name: 'Gold',
    key: 'gold',
    path: '/resources/gold.webp'
  },
  {
    name: 'Iron',
    key: 'iron',
    path: '/resources/iron.webp'
  },
  {
    name: 'Wood',
    key: 'wood',
    path: '/resources/wood.webp'
  },
  {
    name: 'Food',
    key: 'food',
    path: '/resources/food.webp'
  }
]
const unitTypes = [
  {
    name: 'Infantry',
    key: 'infantry',
    order: 5,
  },
  {
    name: 'Archers',
    key: 'archers',
    order: 3
  },
  {
    name: 'Cavalry',
    key: 'cavalry',
    order: 4
  },
  {
    name: 'Siege',
    key: 'siege',
    order: 1,
  },
  {
    name: 'Wall',
    key: 'wall',
    order: 2
  },
]
const initUnitType = async (world: IWorld) => {
  const DefaultUnitTypesModel = new DefaultUnitTypes(world.tenant).getInstance()
  for (const unitType of unitTypes) {
    const isExist = await DefaultUnitTypesModel.findOne({ key: unitType.key })
    if (isExist) {
      await DefaultUnitTypesModel.findByIdAndUpdate(isExist._id, unitType)
    } else {
      await DefaultUnitTypesModel.create(unitType)
    }
  }
}

const initResource = async (world: IWorld) => {
  const DefaultResourceModel = new DefaultResources(world.tenant).getInstance()
  for (const resource of resources) {
    const isExist = await DefaultResourceModel.findOne({ key: resource.key })
    if (isExist) {
      await DefaultResourceModel.findByIdAndUpdate(isExist._id, resource)
    } else {
      await DefaultResourceModel.create(resource)
    }
  }
}
const initBuilding = async (world: IWorld) => {
  const DefaultBuildingsModel = new DefaultBuildings(world.tenant).getInstance()
  const DefaultResourceModel = new DefaultResources(world.tenant).getInstance()
  const DefaultUpgradeModel = new DefaultUpgrade(world.tenant).getInstance()
  const gold = await DefaultResourceModel.findOne({ key: 'gold' })
  const iron = await DefaultResourceModel.findOne({ key: 'iron' })
  const wood = await DefaultResourceModel.findOne({ key: 'wood' })
  const food = await DefaultResourceModel.findOne({ key: 'food' })
  for (const building of buildings) {
    const isExist = await DefaultBuildingsModel.findOne({ name: building.name })
    let resource: any;
    if (building.resource) {
      resource = await DefaultResourceModel.findOne({ key: building.resource })
    }
    if (isExist) {
      await DefaultBuildingsModel.findByIdAndUpdate(isExist._id, {
        name: building.name,
        key: building.key,
        description: building.description,
        type: building.type,
        path: building.path,
        resource: resource?._id
      })
      for (const upgrade of building.upgrade) {
        const isExistUpgrade = await DefaultUpgradeModel.findOne({ building: isExist._id, level: upgrade.level })
        if (isExistUpgrade) {
          const generate = resource ? Math.round(upgrade.generate / 5) : upgrade.generate
          await DefaultUpgradeModel.findByIdAndUpdate(isExistUpgrade._id, {
            building: isExist._id,
            generate: generate,
            time: upgrade.time * 5 / world.speed,
            resources: {
              asArray: [
                { type: gold?._id, value: upgrade.gold },
                { type: iron?._id, value: upgrade.iron },
                { type: wood?._id, value: upgrade.wood },
                { type: food?._id, value: upgrade.food },
              ],
              asObject: {
                gold: upgrade.gold,
                iron: upgrade.iron,
                wood: upgrade.wood,
                food: upgrade.food,
              }
            }
          })
        } else {
          await DefaultUpgradeModel.create({
            building: isExist._id,
            level: upgrade.level,
            generate: upgrade.generate,
            time: upgrade.time * 5 / world.speed,
            resources: {
              asArray: [
                { type: gold?._id, value: upgrade.gold },
                { type: iron?._id, value: upgrade.iron },
                { type: wood?._id, value: upgrade.wood },
                { type: food?._id, value: upgrade.food },
              ],
              asObject: {
                gold: upgrade.gold,
                iron: upgrade.iron,
                wood: upgrade.wood,
                food: upgrade.food,
              }
            }
          })
        }
      }
    } else {
      const createBuilding = await DefaultBuildingsModel.create({
        name: building.name,
        key: building.key,
        description: building.description,
        type: building.type,
        path: building.path,
        resource: resource?._id
      })
      for (const upgrade of building.upgrade) {
        await DefaultUpgradeModel.create({
          building: createBuilding._id,
          level: upgrade.level,
          generate: upgrade.generate,
          time: upgrade.time * 5 / world.speed,
          resources: {
            asArray: [
              { type: gold?._id, value: upgrade.gold },
              { type: iron?._id, value: upgrade.iron },
              { type: wood?._id, value: upgrade.wood },
              { type: food?._id, value: upgrade.food },
            ],
            asObject: {
              gold: upgrade.gold,
              iron: upgrade.iron,
              wood: upgrade.wood,
              food: upgrade.food,
            }
          }
        })
      }
    }
  }
}

const initUnits = async (world: IWorld) => {
  const DefaultUnitsModel = new DefaultUnits(world.tenant).getInstance()
  const DefaultBuildingsModel = new DefaultBuildings(world.tenant).getInstance()
  const DefaultResourceModel = new DefaultResources(world.tenant).getInstance()
  const DefaultUnitTypesModel = new DefaultUnitTypes(world.tenant).getInstance()
  const gold = await DefaultResourceModel.findOne({ key: 'gold' })
  const iron = await DefaultResourceModel.findOne({ key: 'iron' })
  const wood = await DefaultResourceModel.findOne({ key: 'wood' })
  const food = await DefaultResourceModel.findOne({ key: 'food' })

  const infantry = await DefaultUnitTypesModel.findOne({ key: 'infantry' })
  const archers = await DefaultUnitTypesModel.findOne({ key: 'archers' })
  const cavalry = await DefaultUnitTypesModel.findOne({ key: 'cavalry' })
  const siege = await DefaultUnitTypesModel.findOne({ key: 'siege' })
  const wall = await DefaultUnitTypesModel.findOne({ key: 'wall' })
  for (const unit of units) {
    const building = await DefaultBuildingsModel.findOne({ name: unit.building })
    const isExist = await DefaultUnitsModel.findOne({ key: unit.key })
    const unitType = await DefaultUnitTypesModel.findOne({ key: unit.type })
    if (isExist) {
      await DefaultUnitsModel.findByIdAndUpdate(isExist._id, {
        name: unit.name,
        order: unitType?.order,
        description: unit.description,
        type: unitType?._id,
        building: building?._id,
        time: unit.time * 5 / world.speed,
        speed: unit.speed,
        cargo: unit.cargo,
        life: unit.life,
        range: unit.range,
        population: unit.population,
        path: unit.path,
        resources: {
          asArray: [
            { type: gold?._id, value: unit.resource.gold },
            { type: iron?._id, value: unit.resource.iron },
            { type: wood?._id, value: unit.resource.wood },
            { type: food?._id, value: unit.resource.food },
          ],
          asObject: {
            gold: unit.resource.gold,
            iron: unit.resource.iron,
            wood: unit.resource.wood,
            food: unit.resource.food,
          }
        },
        strength: {
          asArray: [
            { type: infantry?._id, value: unit.strength.infantry },
            { type: archers?._id, value: unit.strength.archers },
            { type: cavalry?._id, value: unit.strength.cavalry },
            { type: siege?._id, value: unit.strength.siege },
            { type: wall?._id, value: unit.strength.wall },
          ],
          asObject: {
            infantry: unit.strength.infantry,
            archers: unit.strength.archers,
            cavalry: unit.strength.cavalry,
            siege: unit.strength.siege,
            wall: unit.strength.wall,
          }
        }
      })
    } else {
      await DefaultUnitsModel.create({
        name: unit.name,
        key: unit.key,
        order: unitType?.order,
        description: unit.description,
        type: unitType?._id,
        building: building?._id,
        time: unit.time * 5 / world.speed,
        speed: unit.speed,
        cargo: unit.cargo,
        life: unit.life,
        range: unit.range,
        population: unit.population,
        path: unit.path,
        resources: {
          asArray: [
            { type: gold?._id, value: unit.resource.gold },
            { type: iron?._id, value: unit.resource.iron },
            { type: wood?._id, value: unit.resource.wood },
            { type: food?._id, value: unit.resource.food },
          ],
          asObject: {
            gold: unit.resource.gold,
            iron: unit.resource.iron,
            wood: unit.resource.wood,
            food: unit.resource.food,
          }
        },
        strength: {
          asArray: [
            { type: infantry?._id, value: unit.strength.infantry },
            { type: archers?._id, value: unit.strength.archers },
            { type: cavalry?._id, value: unit.strength.cavalry },
            { type: siege?._id, value: unit.strength.siege },
            { type: wall?._id, value: unit.strength.wall },
          ],
          asObject: {
            infantry: unit.strength.infantry,
            archers: unit.strength.archers,
            cavalry: unit.strength.cavalry,
            siege: unit.strength.siege,
            wall: unit.strength.wall,
          }
        }
      })
    }
  }
}

export default async function initDefault(world: IWorld) {
  console.log('Start init world ' + world.name);
  await initResource(world)
  console.log('Init Resource');
  await initUnitType(world)
  console.log('Init Unit Type');
  await initBuilding(world)
  console.log('Init Building');
  await initUnits(world)
  console.log('Init Units');
  console.log('DONE INIT WORLD ' + world.name);
}