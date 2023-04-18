import { BattleRoundUnitPopulate } from "./UnitService/const";

export const BattleRoundPopulate = [
  {
    path: 'attacker.start attacker.end attacker.dead defender.start defender.end defender.dead',
    populate: BattleRoundUnitPopulate
  }
]