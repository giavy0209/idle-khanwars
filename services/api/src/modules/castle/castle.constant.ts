import { BUILDING_POPULATE } from 'modules/building/building.constant';
import { RESOURCE_POPULATE } from 'modules/resource/resource.constant';
import { UNIT_POPULATE } from 'modules/unit/unit.constant';
import { PopulateOptions } from 'mongoose';

export const CASTLE_POPULATE: PopulateOptions[] = [
  {
    path: 'resources',
    populate: RESOURCE_POPULATE,
  },
  {
    path: 'buildings',
    populate: BUILDING_POPULATE,
  },
  {
    path: 'units',
    populate: UNIT_POPULATE,
  },
  {
    path: 'trainings',
  },
  {
    path: 'upgrades',
  },
];

export const CASTLE_SIMPLE_SELECT = {
  coordinate: 1,
  isCapital: 1,
};
