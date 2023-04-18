import { AbstractService } from "abstracts";
import RoundService from "..";
import { BattleTurns } from "models";
import ActionService from "./ActionService";

export default class TurnService extends AbstractService<BattleTurns> {
  RoundService: RoundService
  ActionService: ActionService
  constructor(RoundService: RoundService) {
    super(BattleTurns, RoundService.user)
    this.RoundService = RoundService
    this.ActionService = new ActionService(this)
  }
}