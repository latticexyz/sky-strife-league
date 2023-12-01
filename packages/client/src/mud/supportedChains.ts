import { MUDChain, mudFoundry } from "@latticexyz/common/chains";

export const redstone = {
    id: 17001,
    name: "Redstone Holesky",
    network: "redstone-holesky",
    summary: {
        location: "Holesky",
    },
    description: "Redstone Holesky",
    iconUrl:
        "https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg",
    nativeCurrency: {
        decimals: 18,
        name: "Holesky Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {
            http: ["https://17001-proxyd.quarry.linfra.xyz"],
            webSocket: ["wss://17001-proxyd.quarry.linfra.xyz/ws"],
        },
        public: {
            http: ["https://17001-proxyd.quarry.linfra.xyz"],
            webSocket: ["wss://17001-proxyd.quarry.linfra.xyz/ws"],
        },
    },
    blockExplorers: {
        default: {
            name: "Blockscout",
            url: "https://17001-explorer.quarry.linfra.xyz",
        },
    },
    testnet: true,
    indexerUrl: "https://indexer.holesky.redstone.xyz/trpc",
};

// If you are deploying to chains other than anvil or Lattice testnet, add them here
export const supportedChains: MUDChain[] = [mudFoundry, redstone];
