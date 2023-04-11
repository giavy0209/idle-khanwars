import { AbstractService } from "abstracts";
import RoundService from "..";
import { BattleTurns } from "models";

export default class TurnService extends AbstractService<BattleTurns> {
  RoundService: RoundService
  constructor(RoundService: RoundService) {
    super(BattleTurns, RoundService.user)
    this.RoundService = RoundService
  }
}