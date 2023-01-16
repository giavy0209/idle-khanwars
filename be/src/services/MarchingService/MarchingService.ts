import { AbstractService } from "abstracts"
import { IMarching, IMarchingPullPopulate } from "interfaces"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Marchings } from "models"
export default class MarchingService extends AbstractService<IMarching, IMarchingPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(Marchings, user)
  }
}