const main = async () => {
    const accounts = await hre.ethers.getSigners();

    /*
    for (const account of accounts) {
      console.log(account.address);
    }
    */
    console.log("Total %d accounts", accounts.length)
    const owner = accounts[0];
    
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    //const waveContract = await waveContractFactory.deploy();
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
      });
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address)

    /*
     * Get Contract balance
     */
    let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
    );
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );

    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave("Foo Bar!");
    await waveTxn.wait(); // wait for the transaction to be mined
    waveCount = await waveContract.getTotalWaves();

    const msgs = ["Where are you from?", "Good weather today.", "Hello!"]
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );

    for ( var i=1; i <= 3; i++){
        waveTxn = await waveContract.connect(accounts[i]).wave(msgs[i-1]);
        await waveTxn.wait();
    
        waveCount = await waveContract.getTotalWaves();
    }
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
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