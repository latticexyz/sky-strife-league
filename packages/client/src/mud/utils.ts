import { encodeEntity } from "@latticexyz/store-sync/recs";
import { Hex } from "viem";

export const addressToEntityID = (address: Hex) => encodeEntity({ address: "address" }, { address });