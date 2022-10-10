import { AbstractService } from "abstracts"
import { IResource } from "interfaces"
import { MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
export default class ResourceService extends AbstractService<IResource>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.resources, user)
  }
}