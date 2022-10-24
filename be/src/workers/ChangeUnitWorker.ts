import { AbstractWorker } from "abstracts";
import { MODEL, POPULATE_UNIT } from "constant";
import { EVENT_SOCKET } from "constant/enums";
import { IUnit, IWorld } from "interfaces";
import { IUnitPullPopulate } from "interfaces/IUnit";
import { Castles } from "models";
import { Types } from "mongoose";
import socketHandler from "socket";

export interface IChangeUnitWorker {
  _id: Types.ObjectId
  value: number
}

export default class ChangeUnitWorker extends AbstractWorker<IUnit, IChangeUnitWorker> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.units, sleep: 1 })
  }
  startWorker() {
    this.start(async ({ _id, value }) => {
      const unit = await this.model.findById(_id).populate<IUnitPullPopulate>(POPULATE_UNIT)
      if (!unit) return
      unit.total = unit.total + value

      await unit.save()
      socketHandler(unit.castle, EVENT_SOCKET.UNIT, unit)
      const castle = await new Castles(this.world.tenant).getInstance().findById(unit.castle)
      if (!castle) return
      castle.population += value * unit.default.population
      await castle.save()
      socketHandler(unit.castle, EVENT_SOCKET.CASTLE, castle)
    })
  }
}