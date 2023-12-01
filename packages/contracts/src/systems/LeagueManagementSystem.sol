// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { LeagueMatch, LeagueOrganizer } from "../codegen/index.sol";

contract LeagueManagementSystem is System {
  function addLeagueMatch(bytes32 matchEntity) organizerOnly public {
    LeagueMatch.set(matchEntity, true);
  }

  function removeLeagueMatch(bytes32 matchEntity) organizerOnly public {
    LeagueMatch.set(matchEntity, false);
  }

  function addLeagueOrganizer(address account) organizerOnly public {
    LeagueOrganizer.set(account, true);
  }

  function removeLeagueOrganizer(address account) organizerOnly public {
    LeagueOrganizer.set(account, false);
  }

  modifier organizerOnly() {
    require(LeagueOrganizer.get(_msgSender()), "LeagueManagementSystem: not organizer");
    _;
  }
}
