import { useState } from "react";
import { toEthAddress } from "@latticexyz/utils";
import { Hex, formatEther } from "viem";
import { useMUD } from "./MUDContext";
import { useComponentValue } from "@latticexyz/react";
import {
  Entity,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { encodeEntity } from "@latticexyz/store-sync/recs";

function PlayerName({ entity }: { entity: Entity }) {
  const {
    network: {
      components: { Name },
    },
  } = useMUD();

  const name = useComponentValue(Name, entity);

  return <div>{name ? name.value : toEthAddress(entity)}</div>;
}

function LeaderboardRow({
  playerEntity,
  record,
  i,
}: {
  playerEntity: Entity;
  record: { wins: number; losses: number };
  i: number;
}) {
  const {
    network: {
      components: { Orb_Balances, SeasonPass_Balances },
    },
  } = useMUD();

  const balance = useComponentValue(
    Orb_Balances,
    playerEntity as Entity
  )?.value;
  const seasonPass = useComponentValue(
    SeasonPass_Balances,
    playerEntity as Entity
  )?.value;

  return (
    <div
      key={playerEntity}
      className="flex justify-between border-0 border-t-2 p-1 hover:bg-slate-200 overflow-hidden"
    >
      <div className="flex space-x-2">
        <div>{i + 1}.</div>
        <PlayerName key={playerEntity} entity={playerEntity as Entity} />
        {Boolean(seasonPass) && <div>🎫</div>}
      </div>

      <div className="flex space-x-4">
        <div className="w-20">Wins: {record.wins}</div>
        <div className="w-24">Losses: {record.losses}</div>
        <div className="w-30">
          Win Ratio: {(record.wins / (record.wins + record.losses)).toFixed(2)}
        </div>
        <div className="w-20 text-right">
          {formatEther(balance ?? 0n, "wei")}🔮
        </div>
      </div>
    </div>
  );
}

export function PlayerLeaderboard({ matches }: { matches: Entity[] }) {
  const {
    network: {
      components: { MatchRanking, OwnedBy },
    },
  } = useMUD();
  
  const playerToRankMapping = {} as Record<
    string,
    {
      wins: number;
      losses: number;
    }
  >;

  for (const match of matches) {
    const ranking = getComponentValue(MatchRanking, match)?.value;
    if (!ranking) {
      continue;
    }

    for (let i = 0; i < ranking.length; i++) {
      const player = ranking[i];
      const wallet = getComponentValueStrict(
        OwnedBy,
        encodeEntity(OwnedBy.metadata.keySchema, {
          entity: player as Hex,
          matchEntity: match as Hex,
        })
      ).value as Hex;

      if (!playerToRankMapping[wallet]) {
        playerToRankMapping[wallet] = {
          wins: 0,
          losses: 0,
        };
      }

      if (i === 0) {
        playerToRankMapping[wallet].wins++;
      } else {
        playerToRankMapping[wallet].losses++;
      }
    }
  }

  return (
    <div className="">
      <div className="text-3xl">Sky Strife Leaderboard</div>
      <div className="h-4" />

      {Object.entries(playerToRankMapping)
        .sort((a, b) => {
          const [_, recordA] = a;
          const [__, recordB] = b;
          return recordB.wins - recordA.wins;
        })
        .map(([playerEntity, record], i) => (
          <LeaderboardRow
            key={playerEntity}
            playerEntity={playerEntity as Entity}
            record={record}
            i={i}
          />
        ))}
    </div>
  );
}
