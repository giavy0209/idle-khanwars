import { AbstractService } from "abstracts"
import { IEnhance } from "interfaces"
import { MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
const populatePath = [
  
]
export default class EnhanceService extends AbstractService<IEnhance>  {
  static populatePath = populatePath
  constructor(user: IUserFullyPopulate) {
    super(MODEL.enhances, user)
    this.populate = populatePath
  }
}