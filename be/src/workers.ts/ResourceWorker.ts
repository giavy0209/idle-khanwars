import { AbstractWorker } from "abstracts";
import { IResource } from "interfaces";
import { Types } from "mongoose";

export interface IResourceWorker {
  _id: Types.ObjectId
  value : number
}

export default class ResourceWorker extends AbstractWorker<IResource, IResourceWorker> {

  startWorker() {
    this.start(async (payload) => {
      payload
    })
  }

}