import { AbstractService } from "abstracts"
import { IEnhance } from "interfaces"
import { MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
export default class EnhanceService extends AbstractService<IEnhance>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.enhances, user)
  }
}