import { IMarchingFullyPopulate } from "interfaces";
import MarchingService from "./MarchingService";
import { BattleService, UnitService } from "services";
import { BATTLE } from "constant/enums";

export default async function handleMarching(
  this: MarchingService,
  marching: IMarchingFullyPopulate
) {
  // const unitService = new UnitService(this.user)
  // const targetUnits = await unitService.find({
  //   query: {
  //     castle: marching.to._id
  //   },
  //   count: false
  // })

  const battleService = new BattleService(this.user)

  const battle = new battleService.model({
    marching: marching._id,
    attacker: marching.from.user._id,
    defender: marching.to.user._id,

    attackerCastle: marching.from._id,
    defenderCastle: marching.to._id
  })

  let round = 1

  // const attackerUnit = marching.units
  // const defenderUnit = targetUnits.map(unit => ({
  //   type: unit,
  //   total: unit.total
  // }))

  const OWNER_TURN = Object.values(BATTLE.ROUND.TURN.OWNER)

  while (true) {
    const createRound = await battleService.RoundService.model.create({
      count: round,
      battle: battle._id,
    })

    for (let index = 1; index <= 5; index++) {
      const defaultUnitType = await this.DefaultUnitTypes.findOne({ order: index })
      if (!defaultUnitType) continue
      for (const ownerTurn of OWNER_TURN) {
        await battleService.RoundService.TurnService.model.create({
          round: createRound._id,
          type: defaultUnitType._id,
          owner: ownerTurn
        })
      }
    }

    round++
    if (round > 30) break
  }
  await battle.save()
}

// async function handleBattleRound(
//   round: number,
//   battle: Types.ObjectId,
//   battleSerivce: BattleService
// ) {

// }