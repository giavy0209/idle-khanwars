import { CASTLE_SIMPLE_SELECT } from 'modules/castle/castle.constant';
import { PopulateOptions } from 'mongoose';

export const USER_POPULATE_CASTLE: PopulateOptions[] = [
  {
    path: 'castles',
    select: CASTLE_SIMPLE_SELECT,
  },
];

export const USER_POPULATE: PopulateOptions[] = [
  ...USER_POPULATE_CASTLE,
  {
    path: 'clan',
  },
];

export const USER_SIMPLE_SELECT = {
  email: 1,
  username: 1,
};
