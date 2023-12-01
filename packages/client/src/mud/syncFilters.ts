import { resourceToHex } from "@latticexyz/common";
import { SyncFilter } from "@latticexyz/store-sync";
import skyStrifeMudConfig from "contracts-skystrife/mud.config";
import mudConfig from "contracts/mud.config";

const MATCH_SPECIFIC_TABLES_NEEDED_IN_AMALGEMA = ["Player", "SpawnReservedBy", "OwnedBy", "LevelContent", "MatchRanking"];

const tables = Object.values(skyStrifeMudConfig.tables).map((table) => {
  const tableId = resourceToHex({
    type: table.offchainOnly ? "offchainTable" : "table",
    // TODO: update once this multiple namespaces is supported (https://github.com/latticexyz/mud/issues/994)
    namespace: skyStrifeMudConfig.namespace,
    name: table.name,
  });
  return { ...table, tableId };
});

const matchSpecificTables = tables.filter((table) => {
  const keyNames = Object.keys(table.keySchema);
  return keyNames[0] === "matchEntity" && keyNames[1] === "entity";
});
const nonMatchSpecificTables = tables.filter((table) => {
  return !matchSpecificTables.includes(table) || MATCH_SPECIFIC_TABLES_NEEDED_IN_AMALGEMA.includes(table.name);
});

const nonMatchSpecificFilters: SyncFilter[] = nonMatchSpecificTables.map((table) => ({ tableId: table.tableId }));

export function createSyncFilters(): SyncFilter[] {
  return [...nonMatchSpecificFilters,
    ...Object.values(mudConfig.tables).map((table) => {
      const tableId = resourceToHex({
        type: table.offchainOnly ? "offchainTable" : "table",
        namespace: mudConfig.namespace,
        name: table.name,
      });
      return { tableId } as SyncFilter;
    })
  ];
}
