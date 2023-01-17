import { AbstractService } from "abstracts"
import { IUnit } from "interfaces"
import { POPULATE_UNIT } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import BuildingService from "services/BuildingService"
import { IUnitPullPopulate } from "interfaces/IUnit"
import { BUILDING, ENHANCE_TYPE } from "constant/enums"
import { Units } from "models"
import { Move } from "./IUnitService"
import { AdvancedError } from "utils"
import { ChangeUnit } from 'eventEmitter'
export default class UnitService extends AbstractService<IUnit, IUnitPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(Units, user)
    this.populate = POPULATE_UNIT
  }
  async create(castle: Types.ObjectId) {
    const defaultUnits = await this.DefaultUnits.find({})
    for (const defaultUnit of defaultUnits) {
      const defaultBuilding = await this.DefaultBuildings.findOne({ _id: defaultUnit.building })
      const buildingService = new BuildingService(this.user)
      const buildingOfThis = await buildingService.findOne({ default: defaultBuilding?._id, castle })
      const enhance0 = await this.DefaultEnhances.find({ unit: defaultUnit._id, level: 0 })
      const enhance = await this.DefaultEnhances.find({ unit: defaultUnit._id, level: 1 })
      await this.model.create({
        castle,
        building: buildingOfThis?._id,
        default: defaultUnit._id,
        enhance: {
          current: {
            hp: enhance0.find(o => o.type === ENHANCE_TYPE.HP),
            cargo: enhance0.find(o => o.type === ENHANCE_TYPE.CARGO),
            attack: enhance0.find(o => o.type === ENHANCE_TYPE.ATTACK),
          },
          next: {
            hp: enhance.find(o => o.type === ENHANCE_TYPE.HP),
            cargo: enhance.find(o => o.type === ENHANCE_TYPE.CARGO),
            attack: enhance.find(o => o.type === ENHANCE_TYPE.ATTACK),
          },
        }
      })
    }
  }

  async get(castle: string) {
    return await this.model.find({ castle }).populate(this.populate)
  }

  async calcPopulationInTower(castle: string | Types.ObjectId) {
    const units = await this.find({ castle }, false)
    let total = 0
    units.forEach(unit => total += unit.inTower * unit.default.population)
    return total
  }

  async move({ unit, type, value }: Move) {
    if (!value || !Number.isInteger(value)) {
      throw new AdvancedError({ message: "Invalid value" })
    }

    const foundUnit = await this.findById(unit, true)

    const buildingService = new BuildingService(this.user)
    const tower = await buildingService.findByKey({ castle: foundUnit.castle._id, key: BUILDING.TOWER })

    const populationInTower = await this.calcPopulationInTower(foundUnit.castle._id)
    switch (type) {
      case 'TO_DEFENSE':
        if (foundUnit.inTower < value) {
          throw new AdvancedError({ message: "Invalid value" })
        }
        break;
      case 'TO_TOWER':
        if (foundUnit.total < value) {
          throw new AdvancedError({ message: "Invalid value" })
        }
        if (populationInTower + value * foundUnit.default.population > tower.upgrade.current.generate) {
          throw new AdvancedError({ message: "Not enough space in tower" })
        }
        break;
      default:
        break;
    }
    ChangeUnit(
      this.user.world.tenant,
      {
        _id: foundUnit._id,
        value: type === 'TO_DEFENSE' ? value : -value,
        toTower: type === 'TO_DEFENSE' ? -value : value
      }
    )
  }

}