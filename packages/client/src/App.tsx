import { SyncStep } from "@latticexyz/store-sync";
import { useMUD } from "./MUDContext";

import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { League } from "./League";

export function App() {
  const {
    network: {
      components: { SyncProgress },
    },
  } = useMUD();

  const syncProgress = useComponentValue(SyncProgress, singletonEntity);
  if (!syncProgress) return <div>Syncing...</div>;

  return (
    <>
      {syncProgress.step === SyncStep.LIVE ? (
        <div className="flex flex-col p-6">
          <League />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-around h-screen">
          <div>
            <div className="text-3xl">
              Syncing Sky Strife World:{" "}
              <span className="text-blue-400">{syncProgress.percentage}%</span>
            </div>
            <div className="text-2xl">{syncProgress.message}</div>
          </div>
        </div>
      )}
    </>
  );
}
