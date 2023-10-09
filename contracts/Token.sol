// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name; 
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply; // 1,000,000 * 10^18
    //uint256 public totalSupply = 1000000000000000000000000; // 1,000,000 * 10^18

    //Track Balances
    mapping(address => uint256) public balanceOf;
    //Send Tokens


    constructor(
        string memory _name, 
        string memory _symbol, 
        uint256 _totalSupply
        ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply; 
        /* msg.sender is actually an address msg.sender 
        holds address of caller of constructor function
         in this case */
    } 

    function transfer(address _to, uint256 _value)
     public 
     returns (bool success)
     {
        // Deduct tokens from spender
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        // Credit token to reciever
        balanceOf[_to] = balanceOf[_to ] + _value;
        return true;
    }
}



