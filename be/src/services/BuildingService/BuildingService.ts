import { AbstractService } from "abstracts"
import { IBuilding } from "interfaces"
import { MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
export default class BuildingService extends AbstractService<IBuilding>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.buildings, user)
  }
}