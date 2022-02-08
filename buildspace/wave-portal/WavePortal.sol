// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves; //state var, auto init to zero
    /*
     * We will be using this below to help generate a random number
     */
    uint256 private seed;
    /*
     * A little magic, Google what events are in Solidity!
     */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /*
     * I created a struct here named Wave.
     * A struct is basically a custom datatype where we can customize 
     * what we want to hold inside it.
     */
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Wave[] waves;
    /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable{
        console.log("Hello WavePortal!");
        /*
        * Set the initial seed
        */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    // _message are sent from the frontend by visitor
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved! w/ message %s", msg.sender, _message);
        // this is the wallet address of the person who
        // called the function

        waves.push(Wave(msg.sender, _message, block.timestamp));
        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        emit NewWave(msg.sender, block.timestamp, _message);

        // you can only receive price if seed greater than the contract sender
        // and you don't wave continuously within the past 15 minutes 
        uint256 timeLimit = lastWavedAt[msg.sender] + 15 minutes;
        //uint256 timeLimit = lastWavedAt[msg.sender] + 1 seconds;
        //console.log(timeLimit);
        //console.log(block.timestamp);
        if ( seed <= 50 && 
             (timeLimit < block.timestamp)){
            uint256 prizeAmount = 0.0001 ether;
            console.log("You win!");
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;
    }

    /*
     * I added a function getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns(uint256){
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}