export const DOMAIN = process.env.REACT_APP_DOMAIN as string

export enum EVENT_SOCKET {
  RESOURCE = 'RESOURCE',
  BUILDING = 'BUILDING'
}

export enum ROUTERS {
  HOME = '/',
  LOGIN = '/login',
  BUILDING = '/building'
} 