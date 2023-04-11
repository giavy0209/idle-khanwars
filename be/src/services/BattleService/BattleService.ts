import { AbstractService } from "abstracts";
import { IBattleFullyPopulate, IUserFullyPopulate } from "interfaces";
import { Battles } from "models";
import RoundService from "./RoundService";

export default class BattleService extends AbstractService<Battles, IBattleFullyPopulate>  {
  RoundService: RoundService
  constructor(user: IUserFullyPopulate) {
    super(Battles, user)
    this.RoundService = new RoundService(this)
  }
}