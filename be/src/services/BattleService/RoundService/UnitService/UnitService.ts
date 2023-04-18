import { AbstractService } from "abstracts";
import { BattleRoundUnits } from "models";
import RoundService from "..";
import { IBattleRoundUnitPullPopulate } from "interfaces";
import { BattleRoundUnitPopulate } from "./const";

export default class UnitService extends AbstractService<BattleRoundUnits, IBattleRoundUnitPullPopulate> {
  RoundService: RoundService
  constructor(RoundService: RoundService) {
    super(BattleRoundUnits, RoundService.user)
    this.RoundService = RoundService
    this.populate = BattleRoundUnitPopulate
  }
}