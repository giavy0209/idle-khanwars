import { AbstractService } from "abstracts"
import { ICastle } from "interfaces"
import { MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
const populatePath = [
  {
    path : 'user',
  }
]
export default class CastleService extends AbstractService<ICastle>  {
  static populatePath = populatePath
  constructor(user: IUserFullyPopulate) {
    super(MODEL.castles, user)
    this.populate = populatePath
  }

  async get () {
    return await this.model.find({user : this.user._id})
  }

  async create () {
    const total = await this.model.countDocuments({user : this.user._id})
    return await this.model.create({
      user : this.user._id,
      name : `${this.user.username}'s Castle ${total + 1}`
    })
  }
}