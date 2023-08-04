export const getDbName = function(tenant?:string ) {
  if(!tenant) return global.Config.MONGODB_NAME
  return `${tenant}_${global.Config.MONGODB_NAME}`
}