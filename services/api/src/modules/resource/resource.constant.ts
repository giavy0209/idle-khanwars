import { BUILDING_POPULATE } from 'modules/building/building.constant';
import { PopulateOptions } from 'mongoose';

export const RESOURCE_POPULATE: PopulateOptions[] = [
  {
    path: 'default',
  },
  {
    path: 'building',
    populate: BUILDING_POPULATE,
  },
];
