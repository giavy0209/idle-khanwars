import { DEFAULT_UPGRADE_POPULATE } from 'modules/default-upgrade/default-upgrade.constant';
import { PopulateOptions } from 'mongoose';

export const BUILDING_POPULATE: PopulateOptions[] = [
  {
    path: 'default',
  },
  {
    path: 'upgrade',
    populate: {
      path: 'current next',
      populate: DEFAULT_UPGRADE_POPULATE,
    },
  },
];

export const BUILDING_UPGRADE_POPULATE: PopulateOptions[] = [
  {
    path: 'upgrade.next',
  },
];

export const BUILDING_LEVEL_POPULATE: PopulateOptions[] = [
  {
    path: 'default',
  },
  {
    path: 'upgrade.current',
  },
];
