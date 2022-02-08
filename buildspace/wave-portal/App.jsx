import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import WebPortal from "./utils/WavePortal_v2.03_01052022.json";
import "./App.css";

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [waveCount, setWaveCount] = useState("");
  const [message, setMessage] = useState("")
    /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress="0xb1182c42B5E2bc6793D4ea468cf21d5ab6C184cF";
  const contractABI = WebPortal.abi;

  function getWaveContract (ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      return new ethers.Contract(contractAddress, contractABI, signer);
  }
  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const wavePortalContract = getWaveContract (ethereum)

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        alert("Make sure Metamask is connected")
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        //console.log("Found an authorized account:", account);
        console.log("Authorized account found");
        setCurrentAccount(account)
        getAllWaves()
      } else {
        console.log("No authorized account found")
      }

      const wavePortalContract = getWaveContract(ethereum);
      let count = await wavePortalContract.getTotalWaves();
      console.log("Current waves:", count.toNumber());
      setWaveCount(count.toNumber());

      

    } catch (error) {
      console.log(error)
    }
  }



 /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }


const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const wavePortalContract = getWaveContract(ethereum);
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        window.location.reload(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
    
      <div className="dataContainer">
        <div className="header">
        👋 Howdy!
        </div>

        <div className="bio">
          My name is David and I am a newbie to the Crypto World. <br/>
          Connect your Ethereum wallet and wave at me!
        </div>
        <div>
          <label>Have something to say? </label>
          <input className="inputField" value={message} onInput={e => setMessage(e.target.value)}/>
        </div>
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount ? (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        ): (
          <button className="userWalletAddr">
            {currentAccount.substring(0,5)+"****"+currentAccount.substring(currentAccount.length-4,currentAccount.length)}
          </button>
        )}
        {currentAccount && (
           <button className="waveCnt">
             {waveCount} waves
            </button> 
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div className="message">Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App