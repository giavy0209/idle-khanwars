import { AbstractService } from "abstracts";
import TurnService from "..";
import { BattleActions } from "models";

export default class ActionService extends AbstractService<BattleActions> {
  TurnService: TurnService
  constructor(TurnService: TurnService) {
    super(BattleActions, TurnService.user)
    this.TurnService = TurnService
  }
}