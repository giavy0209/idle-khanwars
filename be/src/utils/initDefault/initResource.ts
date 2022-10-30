import { IWorld } from "interfaces"
import { DefaultResources } from "models"
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

export default initResource