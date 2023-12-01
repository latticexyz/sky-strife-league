import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "andyleague",
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
