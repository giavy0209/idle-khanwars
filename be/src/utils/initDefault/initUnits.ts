import fs from 'fs'
import path from 'path'
import { IDefaultEnhance, IDefaultUnits, IWorld } from "interfaces"
import { DefaultBuildings, DefaultEnhances, DefaultResources, DefaultUnits, DefaultUnitTypes } from "models"
import { Model } from 'mongoose'
import { ENHANCE_TYPE } from 'constant/enums'
const units = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'defaultData', 'units.json')) as unknown as string)

const createDefaultEnhance = async (model: Model<IDefaultEnhance>, defaultUnit: IDefaultUnits) => {
  const enhanceType = Object.values(ENHANCE_TYPE)
  for (let index = 0; index <= 10; index++) {
    for (const type of enhanceType) {
      const isExist = await model.exists({ unit: defaultUnit._id, level: index, type })
      const objectData = {
        unit: defaultUnit._id,
        level: index,
        type,
        value: index * 10,
        time: defaultUnit.time * 10 * index,
        resources: {
          asArray: defaultUnit.resources.asArray.map(o => ({ ...o, value: o.value * 10 * index })),
          asObject: {
            gold: defaultUnit.resources.asObject.gold * 10 * index,
            iron: defaultUnit.resources.asObject.iron * 10 * index,
            wood: defaultUnit.resources.asObject.wood * 10 * index,
            food: defaultUnit.resources.asObject.food * 10 * index,
          }
        }
      }
      if (isExist) {
        await model.findByIdAndUpdate(isExist._id, objectData)
      } else {
        await model.create(objectData)
      }
    }
  }
}

const initUnits = async (world: IWorld) => {
  const DefaultUnitsModel = new DefaultUnits(world.tenant).getInstance()
  const DefaultBuildingsModel = new DefaultBuildings(world.tenant).getInstance()
  const DefaultResourceModel = new DefaultResources(world.tenant).getInstance()
  const DefaultUnitTypesModel = new DefaultUnitTypes(world.tenant).getInstance()
  const DefaultEnhanceModel = new DefaultEnhances(world.tenant).getInstance()

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
    let defaultUnit = await DefaultUnitsModel.findOne({ key: unit.key })
    const unitType = await DefaultUnitTypesModel.findOne({ key: unit.type })
    const objectData = {
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
    }
    if (defaultUnit) {
      defaultUnit.set({
        ...defaultUnit.toObject(),
        ...objectData
      })
    } else {
      defaultUnit = await DefaultUnitsModel.create(objectData)
    }
    await createDefaultEnhance(DefaultEnhanceModel, defaultUnit)
  }
}

export default initUnits