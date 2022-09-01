import { PopulateOptions } from 'mongoose';

export const DEFAULT_UPGRADE_POPULATE: PopulateOptions[] = [
  {
    path: 'resources.type',
  },
];
