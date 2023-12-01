import { Entity } from "@latticexyz/recs";
import { setupNetwork } from "./setupNetwork";
import mudConfig from "contracts/mud.config";
import { Hex } from "viem";

export function createSystemCalls(
  network: Awaited<ReturnType<typeof setupNetwork>>
) {
  const { worldContract } = network;

  return {
    addLeagueMatch: (matchEntity: Entity) => {
      return (worldContract.write as any)[
        `${mudConfig.namespace}_LeagueManagement_addLeagueMatch`
      ]([matchEntity as Hex]);
    },
    removeLeagueMatch: (matchEntity: Entity) => {
      return (worldContract.write as any)[
        `${mudConfig.namespace}_LeagueManagement_removeLeagueMatch`
      ]([matchEntity as Hex]);
    },
    addLeagueOrganizer: (organizerAddress: Hex) => {
      return (worldContract.write as any)[
        `${mudConfig.namespace}_LeagueManagement_addLeagueOrganizer`
      ]([organizerAddress]);
    },
    removeLeagueOrganizer: (organizerAddress: Hex) => {
      return (worldContract.write as any)[
        `${mudConfig.namespace}_LeagueManagement_removeLeagueOrganizer`
      ]([organizerAddress]);
    },
  };
}
