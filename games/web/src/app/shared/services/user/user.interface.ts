import { IClan } from 'app/clan/clan.interface';
import { ICastle } from '../castle/castle.interface';
import { IWorld } from '../world/world.interface';

export interface IUser {
  _id: string;
  email: string;
  username: string;
  isPlaceCastle: boolean;
  clan?: IClan;
  world: IWorld;
}

export interface IOtherUser extends Omit<IUser, 'isPlaceCastle' | 'clan'> {
  castles: ICastle[];
}

export interface ISignIn {
  token: string;
}

export interface ISignInPayload {
  username: string;
  password: string;
  world: string;
}
