export namespace DEFAULT_BUILDING {
  export enum TYPE {
    RESOURCE = 'RESOURCE',
    BUILDING_ARMY = 'BUILDING_ARMY',
    ACCESSIBLE_BUILDING = 'ACCESSIBLE_BUILDING',
    BUILDING = 'BUILDING',
  }
  export enum KEY {
    GOLD_MIME = 'GOLD_MIME',
    IRON_MINE = 'IRON_MINE',
    LUMBERJACKS = 'LUMBERJACKS',
    FARMS = 'FARMS',
    BARRACKS = 'BARRACKS',
    ARCHERY_RANGE = 'ARCHERY_RANGE',
    STABLES = 'STABLES',
    WORKSHOP = 'WORKSHOP',
    MARKET = 'MARKET',
    DWELLINGS = 'DWELLINGS',
    SHELTER = 'SHELTER',
    TOWER = 'TOWER',
    BLACKSMITH = 'BLACKSMITH',
    INFIRMARY = 'INFIRMARY',
    STORAGE = 'STORAGE',
    ORDER = 'ORDER',
    WALL = 'WALL',
  }
}
export interface IDefaultBuilding {
  name: string;
  key: DEFAULT_BUILDING.KEY;
  description: string;
  type: DEFAULT_BUILDING.TYPE;
  path: string;
  generate: string;
  unit: string;
}
