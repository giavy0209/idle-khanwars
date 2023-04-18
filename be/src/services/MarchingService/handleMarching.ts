import { IBattleRoundUnitFullyPopulate, IMarchingFullyPopulate, MarchingUnitFullyPopulate } from "interfaces";
import MarchingService from "./MarchingService";
import { BattleService, UnitService } from "services";
import { BATTLE } from "constant/enums";
import { Types } from "mongoose";
import { OWNER_TURN } from "constant";

export default async function handleMarching(
  this: MarchingService,
  marching: IMarchingFullyPopulate
) {
  const unitService = new UnitService(this.user)
  const targetUnits = await unitService.find({
    query: {
      castle: marching.to._id
    },
    count: false
  })

  const battleService = new BattleService(this.user)

  const battle = new battleService.model({
    marching: marching._id,
    attacker: marching.from.user._id,
    defender: marching.to.user._id,

    attackerCastle: marching.from._id,
    defenderCastle: marching.to._id
  })


  const defenderUnitDocs = targetUnits.map(unit => new this.MarchingUnitService.model({
    type: unit,
    total: unit.total,
    enhance: unit.enhance.current
  }))
  await this.MarchingUnitService.model.insertMany(defenderUnitDocs)

  const defenderUnit = await this.MarchingUnitService.find({ query: { _id: { $in: defenderUnitDocs.map(o => o._id) } }, count: false })
  const attackerUnit = marching.units

  const defaultUnitType = await this.DefaultUnitTypes.find({})

  let round = 1
  while (true) {
    const createRound = await battleService.RoundService.model.create({
      count: round,
      battle: battle._id,
    })
    //each round create round unit
    const [roundAttackerUnit, roundDefenderUnit] = await Promise.all([
      createRoundUnit(battleService, createRound._id, attackerUnit, BATTLE.ROUND.UNIT.OWNER.ATTACKER_START),
      createRoundUnit(battleService, createRound._id, defenderUnit, BATTLE.ROUND.UNIT.OWNER.DEFENDER_START)
    ])

    const attackerDeadUnit: MarchingUnitFullyPopulate[] = []
    const defenderDeadUnit: MarchingUnitFullyPopulate[] = []

    for (let index = 1; index <= 5; index++) {
      const unitType = defaultUnitType.find(o => o.order === index)
      if (!unitType) continue

      for (const ownerTurn of OWNER_TURN) {
        const createTurn = await battleService.RoundService.TurnService.model.create({
          round: createRound._id,
          type: unitType._id,
          owner: ownerTurn
        })
        let currenAttacktUnit: IBattleRoundUnitFullyPopulate[];
        let currentDefenseUnit: IBattleRoundUnitFullyPopulate[];
        switch (ownerTurn) {
          case BATTLE.ROUND.TURN.OWNER.ATTACKER:
            currenAttacktUnit = roundAttackerUnit.filter(o => o.type.type.default.type._id.toString() === unitType._id.toString())
            currentDefenseUnit = roundDefenderUnit.sort((a, b) => a.type.type.default.range - b.type.type.default.range)
            break;
          case BATTLE.ROUND.TURN.OWNER.DEFENDER:
            currenAttacktUnit = roundDefenderUnit.filter(o => o.type.type.default.type._id.toString() === unitType._id.toString())
            currentDefenseUnit = roundAttackerUnit.sort((a, b) => a.type.type.default.range - b.type.type.default.range)
            break;
          default:
            continue;
        }

        for (const attackerUnit of currenAttacktUnit) {
          if (currentDefenseUnit.length === 0) break
          const cloneAttacketUnit = JSON.parse(JSON.stringify(attackerUnit.toObject()))
          while (true) {
            const defenderUnit = currentDefenseUnit[0]
            if (!defenderUnit) break

            const action = await createAction(
              battleService,
              createTurn._id,
              cloneAttacketUnit,
              defenderUnit
            )
            if (action.defender.remaining <= 0) {
              currentDefenseUnit.splice(0, 1)
            }
            if (action.attacker.remaining <= 0) break
          }
        }
      }
    }

    await Promise.all([
      createRoundUnit(battleService, createRound._id, attackerDeadUnit, BATTLE.ROUND.UNIT.OWNER.ATTACKER_DEAD),
      createRoundUnit(battleService, createRound._id, defenderDeadUnit, BATTLE.ROUND.UNIT.OWNER.DEFENDER_DEAD)
    ])

    round++
    if (round > 30) break
  }
  await battle.save()
}

async function createRoundUnit(
  battleService: BattleService,
  round: Types.ObjectId,
  units: MarchingUnitFullyPopulate[],
  owner: BATTLE.ROUND.UNIT.OWNER
) {
  const roundUnit = units.map(o => new battleService.RoundService.UnitService.model({
    type: o._id,
    owner,
    round,
    total: o.total
  }))
  await battleService.RoundService.UnitService.model.insertMany(roundUnit)
  return battleService.RoundService.UnitService.find({
    query: { _id: { $in: roundUnit.map(o => o._id) } },
    count: false
  })
}

function isCritical() {
  const random = Math.random()
  if (random >= 0.75) return true
  return false
}

async function createAction(
  battleService: BattleService,
  turn: Types.ObjectId,
  attackerUnit: IBattleRoundUnitFullyPopulate,
  defenderUnit: IBattleRoundUnitFullyPopulate
) {
  const defenderUnitType = defenderUnit.type.type.default.type._id
  const defenderUnitEnhance = defenderUnit.type.enhance.hp.value //percent
  const defenderUnitBaseHP = defenderUnit.type.type.default.life //base HP
  const defenderUnitHP = defenderUnitBaseHP + (defenderUnitBaseHP * defenderUnitEnhance / 100)
  const defenderUnitTotalHP = defenderUnitHP * defenderUnit.total

  const attackerUnitBaseStrength = attackerUnit.type.type.default.strength.asArray.find(o => o.type._id.toString() === defenderUnitType.toString())?.value || 0
  const attackerUnitEnhance = attackerUnit.type.enhance.attack.value
  const attackerUnitStrength = attackerUnitBaseStrength + (attackerUnitBaseStrength * attackerUnitEnhance / 100)
  const attackerUnitTotalStrength = attackerUnitStrength * attackerUnit.total

  let totalUse = attackerUnit.total;
  let remainingAttackerUnit = 0;
  let totalDead = 0
  let remaningDefenderUnit = defenderUnit.total
  if (attackerUnitTotalStrength >= defenderUnitTotalHP) {
    totalDead = defenderUnit.total
    remaningDefenderUnit = 0
    totalUse = Math.ceil(defenderUnitTotalHP / attackerUnitStrength)
    remainingAttackerUnit = attackerUnit.total - totalUse
  } else {
    const hpRemaining = defenderUnitTotalHP - attackerUnitTotalStrength
    remaningDefenderUnit = hpRemaining % defenderUnitHP
    if (!isCritical()) remaningDefenderUnit++
    totalDead = defenderUnit.total - remaningDefenderUnit
  }
  attackerUnit.total -= totalUse
  return await battleService.RoundService.TurnService.ActionService.model.create({
    turn,
    attacker: {
      castle: attackerUnit.type.type.castle._id,
      unit: attackerUnit._id,
      totalUnit: totalUse,
      totalDamage: attackerUnitTotalStrength,
      remaining: remainingAttackerUnit,
      type: attackerUnit.type.type.default.type._id,
    },
    defender: {
      castle: defenderUnit.type.type.castle._id,
      unit: defenderUnit._id,
      type: defenderUnitType,
      totalUnit: totalDead,
      totalHP: defenderUnitTotalHP,
      remaining: remaningDefenderUnit,
    }
  })
}