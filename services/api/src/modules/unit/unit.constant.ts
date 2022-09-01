import { BUILDING_LEVEL_POPULATE } from 'modules/building/building.constant';
import { DEFAULT_UNIT_POPULATE } from 'modules/default-unit/default-unit.constant';
import { PopulateOptions } from 'mongoose';

export const UNIT_POPULATE: PopulateOptions[] = [
  {
    path: 'default',
    populate: DEFAULT_UNIT_POPULATE,
  },
];

export const UNIT_SIMPLE_POPULATE: PopulateOptions[] = [
  {
    path: 'default',
  },
  {
    path: 'building',
    populate: BUILDING_LEVEL_POPULATE,
  },
];
