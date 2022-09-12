import mongoose from "mongoose";

let uri = `mongodb://`
let connectString = `${Config.MONGO_HOST}:${Config.MONGO_PORT}/${Config.MONGO_DB}`
let authString = ``
if (Config.MONGO_USER && Config.MONGO_PASSWORD) {
  authString += `${Config.MONGO_USER}:${Config.MONGO_PASSWORD}@`
  connectString += '?authSource=admin'
}
uri += `${authString}${connectString}`
console.log(uri);

mongoose.connect(uri)
  .then(() => {
    console.log('connected DB');
  })