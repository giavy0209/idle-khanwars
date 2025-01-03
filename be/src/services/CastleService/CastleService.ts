import { AbstractService } from "abstracts"
import { ICastlePullPopulate } from "interfaces"
import { POPULATE_CASTLE } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import { ICoordinates, IGetMapInput, IPlaceInput } from "./ICastleService"
import { Request } from "express"
import UserService from "services/UserService"
import { AdvancedError } from "utils"
import socketHandler from "socket"
import { EVENT_SOCKET } from "constant/enums"
import { Castles } from "models"
export default class CastleService extends AbstractService<Castles, ICastlePullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(Castles, user)
    this.populate = POPULATE_CASTLE
  }

  async get() {
    return await this.model.find({ user: this.user._id }, {}).populate(this.populate)
  }

  async getMap({ startX, endX, startY, endY }: IGetMapInput | Request['query']) {
    startX = Number(startX)
    endX = Number(endX)
    startY = Number(startY)
    endY = Number(endY)

    return await this.model.find({
      "coordinate.x": {
        $gte: startX,
        $lte: endX
      },
      "coordinate.y": {
        $gte: startY,
        $lte: endY
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

  async findCastlesByUsers(users: (Types.ObjectId | string)[]) {
    return await this.find({
      query: {
        user: { $in: users },
      },
      idsOnly: true
    })
  }


  calcDistance(from: ICoordinates, to: ICoordinates) {
    const distance = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))
    return distance
  }

  async place({ x, y }: IPlaceInput) {
    await this.exists({
      coordinate: {
        x,
        y
      }
    }, 'IF_EXISTS', 'Someone already place castle here')
    const userService = new UserService(this.user)

    const user = await userService.findById(this.user._id, true)

    if (user.isSelectStart) {
      throw new AdvancedError({ message: "You already place castle", statusCode: 400 })
    }
    user.isSelectStart = true
    await user.save()

    const castle = await this.findOne({ user: this.user._id, isCapital: true }, true)
    castle.coordinate = {
      x, y
    }
    await castle.save()
    socketHandler(castle._id, EVENT_SOCKET.CASTLE, castle)
    socketHandler(castle._id, EVENT_SOCKET.USER, user)
  }
}