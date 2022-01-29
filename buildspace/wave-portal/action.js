const main = async () => {
    const accounts = await hre.ethers.getSigners();

    /*
    for (const account of accounts) {
      console.log(account.address);
    }
    */
    console.log("Total %d accounts", accounts.length)
    const owner = accounts[0];
    const contractAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
    const waveContract = await hre.ethers.getContractAt("WavePortal", contractAddress);

    // Wave Action
    let waveTxn = await waveContract.wave("Foo Bar!");
    await waveTxn.wait(); // wait for the transaction to be mined

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