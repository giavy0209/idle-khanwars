import { BadRequestException, NestMiddleware } from '@nestjs/common'
import { InjectConnection, SchemaFactory } from '@nestjs/mongoose'
import { COLLECTION } from 'enums'
import { NextFunction, Request } from 'express'
import { World } from 'modules/worlds'
import { Connection } from 'mongoose'

export class WorldTenantMiddware implements NestMiddleware {
  constructor(@InjectConnection() private readonly connection : Connection) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const { world } = req.body
    if (!world) throw new BadRequestException()
    
    const db = this.connection.useDb(global.Config.MONGODB_NAME)

    const worldSchema = SchemaFactory.createForClass(World)
    const Worlds = db.model(COLLECTION.worlds,worldSchema)
    const findWorld = await Worlds.findById(world)
    if(!findWorld) {
      throw new BadRequestException(['World not found'])
    }    
    req.tenantId = findWorld.tenant
    next()
  }
}
