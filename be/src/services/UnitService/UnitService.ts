import { AbstractService } from "abstracts"
import { IUnit } from "interfaces"
import { MODEL, POPULATE_UNIT } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import BuildingService from "services/BuildingService"
import { IUnitPullPopulate } from "interfaces/IUnit"
import { ENHANCE_TYPE } from "constant/enums"
export default class UnitService extends AbstractService<IUnit, IUnitPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.units, user)
    this.populate = POPULATE_UNIT
  }
  async create(castle: Types.ObjectId) {
    const defaultUnits = await this.DefaultUnits.find({})
    for (const defaultUnit of defaultUnits) {
      const defaultBuilding = await this.DefaultBuildings.findOne({ _id: defaultUnit.building })
      const buildingService = new BuildingService(this.user)
      const buildingOfThis = await buildingService.findOne({ default: defaultBuilding?._id, castle })
      const enhance0 = await this.DefaultEnhances.find({ unit: defaultUnit._id, level: 0 })
      const enhance = await this.DefaultEnhances.find({ unit: defaultUnit._id, level: 1 })
      await this.model.create({
        castle,
        building: buildingOfThis?._id,
        default: defaultUnit._id,
        enhance: {
          current: {
            hp: enhance0.find(o => o.type === ENHANCE_TYPE.HP),
            cargo: enhance0.find(o => o.type === ENHANCE_TYPE.CARGO),
            attack: enhance0.find(o => o.type === ENHANCE_TYPE.ATTACK),
          },
          next: {
            hp: enhance.find(o => o.type === ENHANCE_TYPE.HP),
            cargo: enhance.find(o => o.type === ENHANCE_TYPE.CARGO),
            attack: enhance.find(o => o.type === ENHANCE_TYPE.ATTACK),
          },
        }
      })
    }
  }

  async get(castle: string) {
    return await this.model.find({ castle }).populate(this.populate)
  }

}