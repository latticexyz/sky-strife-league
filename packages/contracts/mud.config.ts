import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "CHANGE_THIS",
  tables: {
    LeagueMatch: "bool",
    LeagueOrganizer: {
      keySchema: {
        player: "address",
      },
      valueSchema: "bool",
    },
  },
});
