import { AbstractService } from "abstracts"
import { IUnit } from "interfaces"
import { POPULATE_UNIT } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import BuildingService from "services/BuildingService"
import { IUnitFullyPopulate, IUnitPullPopulate } from "interfaces/IUnit"
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

  isEnoughUnit(units: IUnitFullyPopulate[], selectedUnits: { _id: string | Types.ObjectId, selected: number }[]) {
    const selectedUnit: {
      total: number,
      unit: Types.ObjectId
    }[] = []

    for (const unit of units) {
      const totalSelected = selectedUnits.find(o => o._id === unit._id.toString())
      if (!totalSelected) {
        throw new AdvancedError({ message: "Unit not found" })
      }
      if (totalSelected.selected > unit.total) {
        throw new AdvancedError({ message: `You don't have enough ${unit.default.name} ${unit.total}(${totalSelected.selected})` })
      }
      selectedUnit.push({ unit: unit._id, total: totalSelected.selected })
    }
    return selectedUnit
  }

  async get(castle: string) {
    return await this.model.find({ castle }).populate(this.populate)
  }

  calcMovingTime(units: IUnitFullyPopulate[], distance: number) {
    let slowestUnitSpeed = units[0].default.speed

    units.forEach(unit => {
      if (slowestUnitSpeed < unit.default.speed) slowestUnitSpeed = unit.default.speed
    })
    console.log({
      movingTime: slowestUnitSpeed * distance * 60 * 1000,
      speed: slowestUnitSpeed,
    });

    return {
      movingTime: slowestUnitSpeed * distance * 60 * 1000,
      speed: slowestUnitSpeed,
    }
  }

  calcPopulation(units: IUnitFullyPopulate[]) {
    let total = 0
    units.forEach(unit => total += unit.inTower * unit.default.population)
    return total
  }

  async calcPopulationInTower(castle: string | Types.ObjectId) {
    const units = await this.find({
      query: { castle },
      count: false,
    })
    return this.calcPopulation(units)
  }

  async isFromOneCastle(unitIds: (string | Types.ObjectId)[]) {
    const findUnits = await this.find({
      query: { _id: { $in: unitIds } },
      count: false,
    })
    if (findUnits.length === 0) {
      throw new AdvancedError({ message: "You are not select any unit" })
    }
    const castle = findUnits[0].castle.toString()
    const isDiffCastle = findUnits.find(unit => unit.castle.toString() !== castle)
    if (isDiffCastle) {
      return false
    }
    return findUnits
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