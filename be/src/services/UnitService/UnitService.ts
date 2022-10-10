import { AbstractService } from "abstracts"
import { IUnit } from "interfaces"
import { MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
export default class UnitService extends AbstractService<IUnit>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.units, user)
  }
}