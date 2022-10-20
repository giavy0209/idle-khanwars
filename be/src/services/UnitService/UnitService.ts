import { AbstractService } from "abstracts"
import { IUnit } from "interfaces"
import { MODEL, POPULATE_UNIT } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import BuildingService from "services/BuildingService"
import { IUnitPullPopulate } from "interfaces/IUnit"
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
      await this.model.create({
        castle,
        building: buildingOfThis?._id,
        default: defaultUnit._id,
      })
    }
  }

  async get(castle: string) {
    return await this.model.find({ castle }).populate(this.populate)
  }

}