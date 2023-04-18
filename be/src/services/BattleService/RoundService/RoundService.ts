import { AbstractService } from "abstracts";
import { IBattleFullyPopulate, IBattleRoundPullPopulate } from "interfaces";
import BattleService from "../BattleService";
import { BattleRounds } from "models";
import TurnService from "./TurnService";
import UnitService from "./UnitService";
import { BattleRoundPopulate } from "./const";

export default class RoundService extends AbstractService<BattleRounds, IBattleRoundPullPopulate>  {
  BattleService: BattleService
  TurnService: TurnService
  UnitService: UnitService
  constructor(BattleService: BattleService) {
    super(BattleRounds, BattleService.user)
    this.TurnService = new TurnService(this)
    this.UnitService = new UnitService(this)
    this.BattleService = BattleService
    this.populate = BattleRoundPopulate
  }
}