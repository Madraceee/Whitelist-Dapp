const { ethers } = require("hardhat")

async function main(){

  // creating an instance of the whitelist contract
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  // Deploying the contract with the parameter 10 (maximum number of address)
  const deployedWhitelistContract = await whitelistContract.deploy(10);

  // waiting for deployment in the network
  await deployedWhitelistContract.deployed();


  console.log("Whitelist Contract address:",deployedWhitelistContract.address);
}

main()
  .then(()=> process.exit(0))
  .catch(error=>{
    console.log(error);
    process.exit(1)
  });