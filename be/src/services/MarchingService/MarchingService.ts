import { AbstractService } from "abstracts"
import { IMarching, IMarchingPullPopulate } from "interfaces"
import { MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
export default class MarchingService extends AbstractService<IMarching, IMarchingPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.marchings, user)
  }
}