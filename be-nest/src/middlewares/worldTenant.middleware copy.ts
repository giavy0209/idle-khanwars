import { BadRequestException, NestMiddleware } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { COLLECTION } from 'enums'
import { NextFunction, Request } from 'express'
import { WorldSchema } from 'modules/worlds/worlds.schema'
import { Connection } from 'mongoose'

export class WorldTenantMiddware implements NestMiddleware {
  constructor(@InjectConnection() private readonly connection : Connection) {}
  async use(req: Request, _: Response, next: NextFunction) {
    console.log(2);
    
    const { world } = req.body
    if (!world) throw new BadRequestException()
    
    const db = this.connection.useDb(global.Config.MONGODB_NAME)
    const Worlds = db.model(COLLECTION.worlds, WorldSchema)
    const findWorld = await Worlds.findById(world)
    if(!findWorld) {
      throw new BadRequestException('World not found')
    }    
    req.tenantId = findWorld.tenant
    next()
  }
}
