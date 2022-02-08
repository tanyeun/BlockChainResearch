
const { ethers, upgrades } = require('hardhat');

async function main () {
  const Wave = await ethers.getContractFactory('WavePortal');
  console.log('Deploying WavePortal...');
  const wave = await upgrades.deployProxy(Wave, ["hello!"], { initializer: 'wave' });
  await wave.deployed();
  console.log('WavePortal Proxy deployed to:', wave.address);
}

main();