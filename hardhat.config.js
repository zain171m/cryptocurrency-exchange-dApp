require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

PrivateKeys = process.env.DEPLOYER_PRIVATE_KEY || ""
AlchemyApi = process.env.ALCHEMY_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */


module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${AlchemyApi}`,
      accounts: PrivateKeys.split(','),
    },
  },
};
 