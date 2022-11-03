import { HydratedDocument, UnpackedIntersection } from "mongoose"

export type MergePopulate<I, IP> = UnpackedIntersection<HydratedDocument<I, {}, {}>, IP>