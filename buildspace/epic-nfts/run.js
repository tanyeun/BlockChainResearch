const main = async () => {
    // compile contract and generate the necessary files under artifacts
    const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
    // deploy this contract to local eth network and will destroy the contract
    // after script stop
    const nftContract = await nftContractFactory.deploy();
    // the contract officially mined and deployed on this blockchain
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();