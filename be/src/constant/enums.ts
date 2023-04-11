export enum STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum PROGRESS {
  PENDING = "PENDING",
  FINISH = "FINISH",
  CANCEL = "CANCEL",
}

export enum EVENT_SOCKET {
  USER = 'USER',
  CASTLE = 'CASTLE',
  UNIT = 'UNIT',
  RESOURCE = 'RESOURCE',
  BUILDING = 'BUILDING',
  UPGRADE = 'UPGRADE',
  UPGRADE_DONE = 'UPGRADE_DONE',
  TRAINING = 'TRAINING',
  TRAINING_DONE = 'TRAINING_DONE',
  ENHANCE = 'ENHANCE',
  ENHANCE_DONE = 'ENHANCE_DONE',
  MARCHING = 'MARCHING',
  MARCHING_DONE = 'MARCHING_DONE'
}

export enum BUILDING {
  STORAGE = "STORAGE",
  DWELLINGS = "DWELLINGS",
  BLACKSMITH = "BLACKSMITH",
  TOWER = "TOWER",
}

export enum ENHANCE_TYPE {
  HP = "HP",
  ATTACK = "ATTACK",
  CARGO = "CARGO",
}

export namespace MARCHING {
  export enum STATUS {
    TO_TARGET = "TO_TARGET",
    GO_HOME = "GO_HOME",
    DONE = "DONE",
  }
  export enum ACTION {
    ATTACK = 'ATTACK',
    SPY = 'SPY',
    PATROL = 'PATROL',
    CARAVAN = 'CARAVAN',
  }
}
export namespace BATTLE {
  export namespace ROUND {
    export namespace UNIT {
      export enum OWNER {
        ATTACKER_START = "ATTACKER_START",
        ATTACKER_END = "ATTACKER_END",
        ATTACKER_DEAD = "ATTACKER_DEAD",
        DEFENDER_START = "DEFENDER_START",
        DEFENDER_END = "DEFENDER_END",
        DEFENDER_DEAD = "DEFENDER_DEAD",
      }
    }
    export namespace TURN {
      export enum OWNER {
        ATTACKER = "ATTACKER",
        DEFENDER = "DEFENDER"
      }
    }
  }
}

export namespace UNIT {
  export enum TYPE {
    INFANTRY = "INFANTRY",
    ARCHERS = "ARCHERS",
    CAVALRY = "CAVALRY",
    SIEGE = "SIEGE"
  }
}