import { IWorld } from "interfaces"
import { DefaultUnitTypes } from "models"
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

export default initUnitType