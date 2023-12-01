import {
  Entity,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { useMUD } from "./MUDContext";
import { PromiseButton } from "./PromiseButton";
import { Hex } from "viem";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useAdmin } from "./hooks/useAdmin";

export function MatchListing({ matches }: { matches: Entity[] }) {
  const {
    network: {
      components: { MatchIndex, LeagueMatch, MatchRanking, OwnedBy, Name },
    },
    systemCalls: { addLeagueMatch, removeLeagueMatch },
  } = useMUD();

  const admin = useAdmin();

  const sortedMatches = matches.sort((a, b) => {
    const aIndex = getComponentValue(MatchIndex, a)?.matchIndex;
    const bIndex = getComponentValue(MatchIndex, b)?.matchIndex;
    if (!aIndex || !bIndex) {
      return 0;
    }

    return bIndex - aIndex;
  });

  return (
    <div>
      <h1 className="text-3xl">Matches</h1>

      <div className="h-4" />

      <div className="grid grid-cols-3 gap-4 h-[320px] overflow-y-scroll">
        {sortedMatches.map((match) => {
          const index = getComponentValue(MatchIndex, match)?.matchIndex;
          const isLeague = getComponentValue(LeagueMatch, match)?.value;
          const ranking = getComponentValue(MatchRanking, match)?.value;

          return (
            <div key={match} className="bg-gray-200 p-4 rounded">
              <div className="flex items-center justify-between">
                Match #{index}
                {admin && (
                  <>
                    {isLeague ? (
                      <PromiseButton
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        promise={() => removeLeagueMatch(match as Entity)}
                      >
                        Remove from League
                      </PromiseButton>
                    ) : (
                      <PromiseButton
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        promise={() => addLeagueMatch(match as Entity)}
                      >
                        Add to League
                      </PromiseButton>
                    )}
                  </>
                )}
              </div>

              <div>
                {ranking?.map((player, i) => {
                  const owningWallet = getComponentValueStrict(
                    OwnedBy,
                    encodeEntity(OwnedBy.metadata.keySchema, {
                      entity: player as Hex,
                      matchEntity: match as Hex,
                    })
                  ).value as Hex;
                  const name = getComponentValue(
                    Name,
                    owningWallet as Entity
                  )?.value;

                  return (
                    <div
                      key={player}
                      className="flex justify-between border-0 border-t-2 p-1 hover:bg-slate-200 overflow-hidden"
                    >
                      <div className="flex space-x-2">
                        <div>{i + 1}.</div>
                        <div>{name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
