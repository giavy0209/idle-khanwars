import { AbstractService } from "abstracts";
import { IBattleFullyPopulate } from "interfaces";
import BattleService from "../BattleService";
import { BattleRounds } from "models";
import TurnService from "./TurnService/TurnService";

export default class RoundService extends AbstractService<BattleRounds, IBattleFullyPopulate>  {
  BattleService: BattleService
  TurnService: TurnService
  constructor(BattleService: BattleService) {
    super(BattleRounds, BattleService.user)
    this.TurnService = new TurnService(this)
    this.BattleService = BattleService
  }
}