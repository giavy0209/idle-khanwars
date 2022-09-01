import {
  USER_POPULATE_CASTLE,
  USER_SIMPLE_SELECT,
} from 'modules/user/user.constant';
import { PopulateOptions } from 'mongoose';

export const CLAN_POPULATE: PopulateOptions[] = [
  {
    path: 'owner',
    select: USER_SIMPLE_SELECT,
  },
  {
    path: 'isRequest',
  },
];

export const CLAN_REQUEST_POPULATE: PopulateOptions[] = [
  {
    path: 'user',
    select: USER_SIMPLE_SELECT,
    populate: USER_POPULATE_CASTLE,
  },
];

export const CLAN_SIMPLE_SELECT = {
  name: 1,
  description: 1,
};
