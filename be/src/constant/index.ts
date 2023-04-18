import { BATTLE, UNIT } from "./enums"

export const HTTPSTATUS = {
  UNKNOWN: 0,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  MOVED_TEMPORARILY: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LARGE: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
}
export const SUCCESS = 'Success'
export const DATA_FOUND = 'Get data successfully'
export const DATA_CREATED = 'Create data successfully'
export const DATA_UPDATED = 'Update data successfully'
export const DATA_DELETED = 'Delete data successfully'
export const NOT_FOUND = 'Data not found'
export const VALIDATE_ERROR = 'ValidationError'

export const POPULATE_DEFAULT_UPGRADE = [
  {
    path: 'resources.asArray.type building'
  }
]

export const POPULATE_DEFAULT_ENHANCE = [
  {
    path: 'resources.asArray.type'
  }
]

export const POPULATE_BUILDING = [
  {
    path: 'castle default'
  },
  {
    path: 'upgrade.current upgrade.next',
    populate: POPULATE_DEFAULT_UPGRADE
  }
]

export const POPULATE_RESOURCE = [
  {
    path: 'default'
  },
  {
    path: 'building',
    populate: POPULATE_BUILDING
  },
]

export const POPULATE_CASTLE = [
  {
    path: 'user'
  }
]

export const POPULATE_DEFAULT_UNIT = [
  {
    path: 'type building resources.asArray.type strength.asArray.type'
  }
]

export const POPULATE_UNIT = [
  {
    path: 'building',
    populate: POPULATE_BUILDING
  },
  {
    path: 'default',
    populate: POPULATE_DEFAULT_UNIT
  },
  {
    path: 'enhance.current enhance.next',
    populate: {
      path: "hp attack cargo",
      populate: POPULATE_DEFAULT_ENHANCE
    }
  }
]

export const POPULATE_TRAINING = [
  {
    path: 'unit',
    populate: POPULATE_UNIT
  },
]

export const POPULATE_UPGRADE = [
  {
    path: 'building',
    populate: POPULATE_BUILDING
  }
]

export const POPULATE_MARCHING_UNIT = [
  {
    path: 'type',
    populate: POPULATE_UNIT
  },
  {
    path: 'enhance',
    populate: {
      path: "hp attack cargo",
      populate: POPULATE_DEFAULT_ENHANCE
    }
  }
]

export const POPULATE_MARCHING = [
  {
    path: 'from to',
    populate: POPULATE_CASTLE
  },
  {
    path: 'units',
    populate: POPULATE_MARCHING_UNIT
  },
]

export const POPULATE_ENHANCE = [
  {
    path: 'unit',
    populate: POPULATE_UNIT
  }
]


export const MODEL = {
  users: 'users',
  worlds: 'worlds',
  resources: 'resources',
  units: 'units',
  trainings: 'trainings',
  buildings: 'buildings',
  upgrades: 'upgrades',
  castles: 'castles',
  marchings: 'marchings',
  marching_cargoes: 'marching_cargoes',
  marching_units: 'marching_units',
  enhances: 'enhances',

  battles: 'battles',
  battle_rounds: 'battle_rounds',
  battle_round_units: 'battle_round_units',
  battle_turns: 'battle_turns',
  battle_actions: 'battle_actions',

  default_buildings: 'default_buildings',
  default_upgrades: 'default_upgrades',
  default_resources: 'default_resources',
  default_units: 'default_units',
  default_unit_types: 'default_unit_types',
  default_enhances: 'default_enhances',
}

export const UNIT_ORDER = [
  UNIT.TYPE.SIEGE,
  UNIT.TYPE.ARCHERS,
  UNIT.TYPE.CAVALRY,
  UNIT.TYPE.INFANTRY
]

export const OWNER_TURN = Object.values(BATTLE.ROUND.TURN.OWNER)