import { AbstractService } from "abstracts"
import { sign } from "jsonwebtoken"
import { compareSync, hashSync } from "bcrypt"
import { HTTPSTATUS, MODEL } from "constant"
import { IUser } from "interfaces"
import { IUserFullyPopulate, IUserPullPopulate } from "interfaces/IUser"
import { AdvancedError } from "utils"
import { IPostInput } from "./IUserService"
import { STATUS } from "constant/enums"
import BuildingService from "services/BuildingService"
import ResourceService from "services/ResourceService"
import CastleService from "services/CastleService"
import UnitService from "services/UnitService"

const populatePath = [
  {
    path: 'world'
  }
]
export default class UserService extends AbstractService<IUser, IUserPullPopulate>  {
  static populatePath = populatePath
  constructor(user: IUserFullyPopulate) {
    super(MODEL.users, user)
    this.populate = populatePath
  }
  async post({ username, password, world }: IPostInput) {
    await this.exists({ username }, 'IF_EXISTS')
    const user = await this.model.create({
      world,
      username,
      password: hashSync(password, 10)
    }) as unknown as IUserFullyPopulate
    await user.populate('world')
    console.log(user);
    
    const castleService = new CastleService(user)
    const castle = await castleService.create()
 
    const buildingService = new BuildingService(user)
    await buildingService.create(castle._id)

    const resourceService = new ResourceService(user)
    await resourceService.create(castle._id) 

    const unitService = new UnitService(user)
    await unitService.create(castle._id) 

    return user
  }

  async login({ username, password, world }: IPostInput) {
    const user = await this.findOne({ username, world, status: STATUS.ACTIVE }, true)
    const isMatchPassword = compareSync(password, user.password)
    if (!isMatchPassword) {
      throw new AdvancedError({
        statusCode: HTTPSTATUS.BAD_REQUEST,
        message: "Wrong password"
      })
    }
    const tokenPayload = user.toObject()
    delete tokenPayload.createdAt
    delete tokenPayload.updateAt
    delete tokenPayload.lastLogin
    delete tokenPayload.password
    delete tokenPayload.__v
    delete tokenPayload.world.name
    const token = sign(tokenPayload, Config.JWT_SECRET)
    return {
      user,
      token,
    }
  }
} 