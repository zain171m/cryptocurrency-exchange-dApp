const { ethers } = require("hardhat")

async function main() {

  console.log("Starting deployment...")
  console.log(`Preparing deployment...\n`)

  // Fetch contract to deploy
  const Token = await ethers.getContractFactory('Token')
  const Exchange = await ethers.getContractFactory('Exchange')

  // Fetch accounts
  const accounts = await ethers.getSigners()

  console.log(`Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`)


  //deploy tokens
  const Punjab = await Token.deploy("Punjab", "Punjab" , '1000000')
  await Punjab.deployed()
  console.log(`Punjab deployed to: ${Punjab.address}`)

  const mEth = await Token.deploy("mEth", "mEth" , '1000000')
  await mEth.deployed()
  console.log(`mEth deployed to: ${mEth.address}`)

  const mDai = await Token.deploy("mDai", "mDai" , '1000000')
  await mDai.deployed()
  console.log(`mDai deployed to: ${mDai.address}`)

  //Deploying exchange

  const exchange = await Exchange.deploy(accounts[1].address, 10)
  await exchange.deployed()
  console.log(`Exchange Deployed to: ${exchange.address}`)
      

}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
