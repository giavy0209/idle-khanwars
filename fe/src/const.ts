export const DOMAIN = process.env.REACT_APP_DOMAIN as string

export enum EVENT_SOCKET {
  RESOURCE = 'RESOURCE',
  BUILDING = 'BUILDING'
}

export enum ROUTERS {
  HOME = '',
  LOGIN = 'login',
  BUILDING = 'building',
  BUILDING_TYPE = ':buildingType',
  RESOURCE = 'resources',
  ARMY = 'army',
  OTHER = 'other',
}

export enum BUILDING_TYPE {
  resources = "RESOURCE",
  army = 'BUILDING_ARMY',
  other = 'BUILDING'
}