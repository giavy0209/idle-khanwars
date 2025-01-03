import { EVENT_SOCKET } from "const";
import { useSocketHandler } from "hooks";
import { buildingAction, castleAction, enhanceAction, marchingAction, resourceAction, trainingAction, unitAction, upgradeAction, userAction } from "store/slices";

const useSocketHandlers = () => {
  useSocketHandler({
    action: [
      userAction.user
    ],
    event: EVENT_SOCKET.USER
  })
  useSocketHandler({
    action: [
      castleAction.updateCastle
    ],
    event: EVENT_SOCKET.CASTLE
  })
  useSocketHandler({
    action: [
      resourceAction.setResource
    ],
    event: EVENT_SOCKET.RESOURCE
  })
  useSocketHandler({
    action: [
      buildingAction.setBuilding,
      unitAction.setUnitByBuilding,
      resourceAction.setResourceBuilding
    ],
    event: EVENT_SOCKET.BUILDING
  })
  useSocketHandler({
    action: [
      unitAction.setUnit
    ],
    event: EVENT_SOCKET.UNIT,
    callback() {
      console.log('123');

    },
  })
  useSocketHandler({
    action: [
      trainingAction.setTraining
    ],
    event: EVENT_SOCKET.TRAINING
  })
  useSocketHandler({
    action: [
      trainingAction.removeTraining
    ],
    event: EVENT_SOCKET.TRAINING_DONE
  })
  useSocketHandler({
    action: [
      upgradeAction.setUpgrade
    ],
    event: EVENT_SOCKET.UPGRADE
  })
  useSocketHandler({
    action: [
      upgradeAction.removeUpgrade
    ],
    event: EVENT_SOCKET.UPGRADE_DONE
  })
  useSocketHandler({
    action: [
      enhanceAction.setEnhance
    ],
    event: EVENT_SOCKET.ENHANCE
  })
  useSocketHandler({
    action: [
      enhanceAction.removeEnhance
    ],
    event: EVENT_SOCKET.ENHANCE_DONE
  })
  useSocketHandler({
    action: [
      marchingAction.setMarching
    ],
    event: EVENT_SOCKET.MARCHING
  })
  useSocketHandler({
    action: [
      marchingAction.removeMarching
    ],
    event: EVENT_SOCKET.MARCHING_DONE
  })
}

export default useSocketHandlers