import { AbstractController } from "abstracts";
import { IUser } from "interfaces";
import { UserService } from "services";

export default class UserController extends AbstractController<IUser, UserService> {
  constructor() {
    super(UserService)
  }
}

