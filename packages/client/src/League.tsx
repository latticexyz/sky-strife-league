import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { PlayerLeaderboard } from "./PlayerLeaderboard";
import { Has, HasValue } from "@latticexyz/recs";
import { useState } from "react";
import { MatchListing } from "./MatchListing";
import { PromiseButton } from "./PromiseButton";
import { Hex } from "viem";
import { useAdmin } from "./hooks/useAdmin";
import { addressToEntityID } from "./mud/utils";

export function League() {
  const {
    network: {
      components: { MatchConfig, MatchFinished, LeagueMatch, LeagueOrganizer },
      walletClient,
    },
    systemCalls: { addLeagueOrganizer },
  } = useMUD();

  const admin = useAdmin();

  const [leagueOnly, setLeagueOnly] = useState(false);
  const [burnerWalletKey, setBurnerWalletKey] = useState<Hex>("" as Hex);
  const [walletAddress, setWalletAddress] = useState<Hex>("" as Hex);

  const allMatches = useEntityQuery([Has(MatchFinished), Has(MatchConfig)]);
  const leagueMatches = useEntityQuery([
    Has(MatchFinished),
    HasValue(LeagueMatch, { value: true }),
  ]);
  const isOrganizer = useComponentValue(
    LeagueOrganizer,
    addressToEntityID(walletClient.account.address) ?? ""
  )?.value;

  return (
    <div>
      <div className="flex justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setLeagueOnly(!leagueOnly)}
        >
          {leagueOnly ? "Show All" : "Show League Only"}
        </button>

        {admin && (
          <div className="flex flex-col space-y-2">
            <div>
              Connected Admin Address: {walletClient.account.address}{" "}
              {!isOrganizer && (
                <div className="text-xl text-red-500">
                  Warning: You are not a League Organizer. You will not be able to modify League data.
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <input
                className="border border-gray-400 rounded p-4 py-2"
                placeholder="Burner Wallet Private Key"
                value={burnerWalletKey}
                onChange={(e) => setBurnerWalletKey(e.target.value as Hex)}
              />

              <PromiseButton
                disabled={burnerWalletKey.length !== 66}
                className="bg-green-500 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-2 px-4 rounded"
                promise={async () => {
                  localStorage.setItem("mud:burnerWallet", burnerWalletKey);
                  window.location.reload();
                }}
              >
                Import Burner Wallet
              </PromiseButton>

              <input
                className="border border-gray-400 rounded p-4 py-2"
                placeholder="Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value as Hex)}
              />

              <PromiseButton
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                promise={() => addLeagueOrganizer(walletAddress)}
              >
                Add Organizer Address
              </PromiseButton>
            </div>
          </div>
        )}
      </div>

      <div className="h-4" />

      <MatchListing matches={leagueOnly ? leagueMatches : allMatches} />

      <div className="h-4" />

      <PlayerLeaderboard matches={leagueOnly ? leagueMatches : allMatches} />
    </div>
  );
}
