//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract Whitelist{

    // Maximum number of whitelisted address
    uint8 public maxWhitelistAddresses;

    // Mapping between address and boolean value
    // If an address is whitelisted, it is set to true, else it is false by default
    mapping(address=>bool) public whitelistedAddresses;

    // Number of whitelisted address 
    uint8 public numAddressesWhitelisted;

    // Constructor sets the maximum number of whitelisted address at the time of deployment
    constructor(uint8 _maxWhitelistAddresses){
        maxWhitelistAddresses = _maxWhitelistAddresses;
    }



    // Add an address to the whitelist if address is not present in the list and number of address is less than max
    function addAddressToWhitelist() public{
        
        // To check whether user is whitelisted
        require(!whitelistedAddresses[msg.sender],"Sender has already been whitelisted");

        // To check whether the number of whitelisted address are less than maximum number of whitelisted accounts
        require(numAddressesWhitelisted < maxWhitelistAddresses, "More addresses cannot be added");

        whitelistedAddresses[msg.sender] = true;

        numAddressesWhitelisted+=1;
    }

}