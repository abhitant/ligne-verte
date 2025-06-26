
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

// Remplacez par vos clés privées et API keys
const PRIVATE_KEY = process.env.PRIVATE_KEY || "your-private-key-here";
const CELOSCAN_API_KEY = process.env.CELOSCAN_API_KEY || "your-celoscan-api-key";

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [PRIVATE_KEY],
      chainId: 44787,
      gas: 8000000,
      gasPrice: 1000000000 // 1 gwei
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [PRIVATE_KEY],
      chainId: 42220,
      gas: 8000000,
      gasPrice: 1000000000
    }
  },
  etherscan: {
    apiKey: {
      alfajores: CELOSCAN_API_KEY,
      celo: CELOSCAN_API_KEY
    },
    customChains: [
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io"
        }
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io"
        }
      }
    ]
  }
};
