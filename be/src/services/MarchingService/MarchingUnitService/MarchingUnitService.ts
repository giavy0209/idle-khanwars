import { AbstractService } from "abstracts";
import { IUserFullyPopulate } from "interfaces";
import { MarchingUnits } from "models";
import MarchingService from "../MarchingService";

export default class MarchingUnitService extends AbstractService<MarchingUnits>{
  MarchingService: MarchingService
  constructor(user: IUserFullyPopulate, MarchingService: MarchingService) {
    super(MarchingUnits, user)
    this.MarchingService = MarchingService
  }
}