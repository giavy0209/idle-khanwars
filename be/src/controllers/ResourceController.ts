import { AbstractController } from "abstracts";
import { IResource } from "interfaces";
import { ResourceService } from "services";

export default class ResourceController extends AbstractController<IResource, ResourceService> {
  constructor() {
    super(ResourceService)
  }
}

