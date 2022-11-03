export const DOMAIN = process.env.REACT_APP_DOMAIN as string

export enum EVENT_SOCKET {
  USER = 'USER',
  CASTLE = 'CASTLE',
  UNIT = 'UNIT',
  RESOURCE = 'RESOURCE',
  BUILDING = 'BUILDING',
  TRAINING = 'TRAINING',
  TRAINING_DONE = 'TRAINING_DONE',
  UPGRADE = 'UPGRADE',
  UPGRADE_DONE = 'UPGRADE_DONE',
}

export enum ROUTERS {
  HOME = '/',
  LOGIN = '/login',
  MAP = '/map',

  BUILDING = '/building',
  BUILDING_TYPE = ':buildingType',
  RESOURCE = 'resources',
  ARMY = 'army',
  BUILDING_ARMY = 'building_army',
  OTHER = 'other',

  UNIT = '/unit',
  UNIT_TYPE = ':unitType',

  ENHANCE = '/enhance',
  ENHANCE_TYPE = ':enhanceType',
}

export enum BUILDING_TYPE {
  resources = "RESOURCE",
  army = 'BUILDING_ARMY',
  building_army = 'ACCESSABLE_BUILDING',
  other = 'BUILDING'
}



export enum TRAINING_TYPE {
  BARRACKS = "BARRACKS",
  ARCHERY_RANGE = "ARCHERY_RANGE",
  STABLES = "STABLES",
  WORKSHOP = "WORKSHOP",
  ORDER = "ORDER",
}

export enum BUILDING {
  GOLD_MIME = "GOLD_MIME",
  IRON_MINE = "IRON_MINE",
  LUMBERJACKS = "LUMBERJACKS",
  FARMS = "FARMS",
  BARRACKS = "BARRACKS",
  ARCHERY_RANGE = "ARCHERY_RANGE",
  STABLES = "STABLES",
  WORKSHOP = "WORKSHOP",
  ORDER = "ORDER",
  MARKET = "MARKET",
  DWELLINGS = "DWELLINGS",
  SHELTER = "SHELTER",
  TOWER = "TOWER",
  BLACKSMITH = "BLACKSMITH",
  INFIRMARY = "INFIRMARY",
  STORAGE = "STORAGE",
}

export enum BUILDING_DIRECT {
}