import { AbstractService } from "abstracts"
import { ICastle } from "interfaces"
import { MODEL, POPULATE_CASTLE } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import { IGetMapInput } from "./ICastleService"
export default class CastleService extends AbstractService<ICastle>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.castles, user)
    this.populate = POPULATE_CASTLE
  }

  async get() {
    return await this.model.find({ user: this.user._id }, {}).populate(this.populate)
  }
  async getMap({ start, end }: IGetMapInput) {
    return await this.model.find({
      "coordinate.x": {
        $gte: start.x,
        $lte: end.x
      },
      "coordinate.y": {
        $gte: start.y,
        $lte: end.y
      },
    }).populate(this.populate)
  }
  async isOwner(castle: string | Types.ObjectId) {
    await this.exists({
      user: this.user._id,
      _id: castle
    }, 'IF_NOT_EXISTS', 'You cannot action on another castle that you are not owner')
  }

  async create() {
    const total = await this.model.countDocuments({ user: this.user._id })
    return await this.model.create({
      user: this.user._id,
      name: `${this.user.username}'s Castle ${total + 1}`
    })
  }
}