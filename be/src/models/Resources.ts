import { AbstractModel } from "abstracts";
import { IResource } from "interfaces";
import { Schema} from "mongoose";
import { MODEL } from "constant";

class Resources extends AbstractModel<IResource> {
  constructor(tenantId : string) {
    super({name : MODEL.resources,tenantId})
    this.schema = new Schema<IResource>({
      castle : {type : Schema.Types.ObjectId , ref : this.getCollectionName(MODEL.castles)},
      default : {type : Schema.Types.ObjectId , ref : MODEL.default_resources},
      building : {type : Schema.Types.ObjectId , ref : this.getCollectionName(MODEL.buildings)},
      value : {type : Number, default : 100},
      lastUpdate : {type : Date , default : Date.now}
    }, {
      timestamps : true
    })
  }
}

export default Resources