import { AbstractService } from "abstracts";
import { IMarchingUnitPullPopulate, IUserFullyPopulate } from "interfaces";
import { MarchingUnits } from "models";
import MarchingService from "../MarchingService";
import { POPULATE_MARCHING_UNIT } from "constant";

export default class MarchingUnitService extends AbstractService<MarchingUnits, IMarchingUnitPullPopulate>{
  MarchingService: MarchingService
  constructor(user: IUserFullyPopulate, MarchingService: MarchingService) {
    super(MarchingUnits, user)
    this.MarchingService = MarchingService
    this.populate = POPULATE_MARCHING_UNIT
  }
}