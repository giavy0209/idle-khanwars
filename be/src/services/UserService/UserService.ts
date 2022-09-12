import { AbstractService } from "abstracts"
import { IUser } from "interfaces"
import { signup } from "./interfaces"
import { compareSync, hashSync } from 'bcrypt'
import { AdvancedError } from "utils"
import {sign} from 'jsonwebtoken'
export default class UserService extends AbstractService<IUser>  {
  async signup({ username, password }: signup) {
    const isExist = await this.model.exists({ username })
    if (isExist) {
      throw new AdvancedError({
        username: {
          message: 'username is exist'
        }
      })
    }
    const hash = hashSync(password, 10)
    const data = await this.model.create({
      username,
      password: hash,
    })
    return data
  }
  async signin({ username, password }: signup) {
    const user = await this.model.findOne({ username }).lean()
    if (!user) {
      throw new AdvancedError({
        username: {
          message: 'username is not exist'
        }
      })
    }
    const isValidPassword = compareSync(password, user.password)
    if(!isValidPassword) {
      throw new AdvancedError({
        password : {
          message : 'Wrong password'
        }
      })
    }
    
    const payload = user
    const token = sign(payload , Config.JWT_SECRET)
    return {token,user}
  }
}