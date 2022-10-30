import fs from 'fs'
import path from 'path'
import { IDefaultBuilding, IDefaultResources, IDefaultUpgrade, IWorld } from "interfaces"
import { DefaultBuildings, DefaultResources, DefaultUpgrades } from "models"
import { Model } from 'mongoose'
const buildings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'defaultData', 'building.json')) as unknown as string)
interface IUpgrades {
  level: number,
  gold: number,
  iron: number,
  wood: number,
  food: number,
  generate: number,
  time: number
}
const createOrUpdateUpgrade = async (
  model: Model<IDefaultUpgrade>,
  upgrades: IUpgrades[],
  building: IDefaultBuilding,
  world: IWorld,
  isResource: boolean,
  { gold, iron, wood, food }: { [k: string]: IDefaultResources | null }
) => {
  for (const upgrade of upgrades) {
    const generate = isResource ? Math.round(upgrade.generate / 5 * world.speed) : upgrade.generate
    const isExistUpgrade = await model.findOne({ building: building._id, level: upgrade.level })
    const objectData = {
      building: building._id,
      level: upgrade.level,
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
    }
    if (isExistUpgrade) {
      await model.findByIdAndUpdate(isExistUpgrade._id, objectData)
    }
    await model.create(objectData)
  }
}

const initBuilding = async (world: IWorld) => {
  const DefaultBuildingsModel = new DefaultBuildings(world.tenant).getInstance()
  const DefaultResourceModel = new DefaultResources(world.tenant).getInstance()
  const DefaultUpgradeModel = new DefaultUpgrades(world.tenant).getInstance()
  const gold = await DefaultResourceModel.findOne({ key: 'gold' })
  const iron = await DefaultResourceModel.findOne({ key: 'iron' })
  const wood = await DefaultResourceModel.findOne({ key: 'wood' })
  const food = await DefaultResourceModel.findOne({ key: 'food' })
  for (const building of buildings) {
    let findBuilding = await DefaultBuildingsModel.findOne({ name: building.name })
    let resource: any;
    if (building.resource) {
      resource = await DefaultResourceModel.findOne({ key: building.resource })
    }

    const objectData = {
      name: building.name,
      key: building.key,
      description: building.description,
      type: building.type,
      path: building.path,
      resource: resource?._id
    }
    if (findBuilding) {
      findBuilding.set({
        ...findBuilding.toObject(),
        ...objectData
      })
    } else {
      findBuilding = await DefaultBuildingsModel.create(objectData)
    }
    await createOrUpdateUpgrade(DefaultUpgradeModel, building.upgrade, findBuilding, world, resource, { gold, iron, wood, food })
  }
}

export default initBuilding