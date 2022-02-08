import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import twitterLogo from './assets/twitter-logo.svg';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import SelectCharacter from './Components/SelectCharacter';
import myEpicGame from './utils/MyEpicGame.json';
import './App.css';

// Constants
const TWITTER_HANDLE = 'tanyeunee97';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  //Right under current account, setup this new state property
  const [characterNFT, setCharacterNFT] = useState(null);

  function getContract(ethereum){
    if (!ethereum) {
        console.log('Make sure you have MetaMask yo~');
        return null;
    }else{
      console.log("ethereum is good");
      if (ethereum.networkVersion !== '4') {
        alert("Please connect to Rinkeby!");
        return null;
      } 
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
    return contract;
  }

  // Start by creating a new action that we will run on component load
  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderContent = () => {
    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
              src="https://i.imgur.com/TzHBX37.gif"
              alt="SandBox Land Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  
  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();

    //The function we will call that interacts with out smart contract
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const gameContract = getContract(window.ethereum)
      if (!gameContract){
        return;
      }else{
        const txn = await gameContract.checkIfUserHasNFT();
        if (txn.name) {
          console.log('User has character NFT');
          setCharacterNFT(transformCharacterData(txn));
        } else {
          console.log('No character NFT found');
        }
      }
    };

    //We only want to run this, if we have a connected wallet
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Sandbox Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Sandbox Metaverse!</p>
          {/* This is where our button and image code used to be!
           *	Remember we moved it into the render method.
           */}
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
