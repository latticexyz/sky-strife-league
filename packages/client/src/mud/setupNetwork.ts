/*
 * The MUD client code is built on top of viem
 * (https://viem.sh/docs/getting-started.html).
 * This line imports the functions we need from it.
 */
import {
  createPublicClient,
  fallback,
  webSocket,
  http,
  createWalletClient,
  Hex,
  ClientConfig,
} from "viem";
import { createWorld } from "@latticexyz/recs";
import {
  createBurnerAccount,
  createContract,
  transportObserver,
  ContractWrite,
} from "@latticexyz/common";
import { resolveConfig } from "@latticexyz/store";
import { Subject, share } from "rxjs";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import SkyStrifeAbi from "contracts-skystrife/out/world/IWorld.sol/IWorld.abi.json";
import { getNetworkConfig } from "./getNetworkConfig";
import { tables as extraTables, syncFilters as extraSyncFilters } from "./extraTables";

/*
 * Import our MUD config, which includes strong types for
 * our tables and other config options. We use this to generate
 * things like RECS components and get back strong types for them.
 *
 * See https://mud.dev/tutorials/walkthrough/minimal-onchain#mudconfigts
 * for the source of this information.
 */
import mudConfig from "contracts/mud.config";
import skyStrifeConfig from "contracts-skystrife/mud.config";
import { createSyncFilters } from "./syncFilters";
import { syncToRecs } from "@latticexyz/store-sync/recs";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {
  const networkConfig = await getNetworkConfig();

  /*
   * Create a viem public (read only) client
   * (https://viem.sh/docs/clients/public.html)
   */
  const clientOptions = {
    chain: networkConfig.chain,
    transport: transportObserver(fallback([webSocket(), http()])),
    pollingInterval: 1000,
  } as const satisfies ClientConfig;

  const publicClient = createPublicClient(clientOptions);

  /*
   * Create a temporary wallet and a viem client for it
   * (see https://viem.sh/docs/clients/wallet.html).
   */
  const account = createBurnerAccount(networkConfig.privateKey as Hex);
  const walletClient = createWalletClient({
    ...clientOptions,
    account,
  });

  /*
   * Create an observable for contract writes that we can
   * pass into MUD dev tools for transaction observability.
   */
  const write$ = new Subject<ContractWrite>();

  /*
   * Create an object for communicating with the deployed World.
   */
  const worldContract = createContract({
    address: networkConfig.worldAddress as Hex,
    abi: [...IWorldAbi, ...SkyStrifeAbi] as const,
    publicClient,
    walletClient,
    onWrite: (write) => write$.next(write),
  });

  const skyStrifeFilters = [...createSyncFilters(), ...extraSyncFilters];
  const skyStrifeTables = {...extraTables, ...resolveConfig(skyStrifeConfig).tables};

  const world = createWorld();
  const { components, latestBlock$, storedBlockLogs$ } = await syncToRecs({
    world,
    config: mudConfig,
    address: networkConfig.worldAddress as Hex,
    publicClient,
    indexerUrl: networkConfig.indexerUrl,
    startBlock: networkConfig.initialBlockNumber > 0n ? BigInt(networkConfig.initialBlockNumber) : undefined,
    filters: skyStrifeFilters,
    tables: skyStrifeTables,
  });

  return {
    components,
    publicClient,
    walletClient,
    latestBlock$,
    storedBlockLogs$,
    worldContract,
    write$: write$.asObservable().pipe(share()),
    config: networkConfig,
  };
}
