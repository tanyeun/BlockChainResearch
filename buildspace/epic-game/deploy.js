const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(                     
        ["John", "Michael", "Mary", "Kevin", "Eric", "Frank"],       // Names
        ["https://i.imgur.com/KOonknS.png", // Images
        "https://i.imgur.com/6IucaWm.jpg", 
        "https://i.imgur.com/zZHgA9I.jpg",
        "https://i.imgur.com/glrRzDk.jpg",
        "https://i.imgur.com/1IIAyKD.jpg",
        "https://i.imgur.com/Vyuo5pd.jpg"],
        [100, 200, 300, 400, 500, 600],                    // HP values
        [100, 50, 25, 60, 80, 100],                       // Attack damage values
        "Alpha Dragon", // Boss name
        "https://i.imgur.com/R3varfy.jpg", // Boss image
        10000, // Boss hp
        50 // Boss attack damage              
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
  
    /*
    let txn;
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();
    console.log("Done deploying and minting!");
    */
   
    /*
    console.log("Attack Boss");
    txn = await gameContract.attackBoss();
    await txn.wait();
    console.log("Done!");
    */
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