// SPDX-License-Identifier: MLT

pragma solidity 0.8.7;

import "./PriceConverter.sol";

error FundMe_NotOwner();

contract FundMe{

    using PriceConverter for uint256;

    address public owner;
    AggregatorV3Interface public priceFeed; //priceFeed is a contract by chainlink

    constructor(address priceFeedAddress){
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    modifier onlyOwner(){
        if(msg.sender != owner) revert FundMe_NotOwner();
        _;
    }

    address[] public funders;
    mapping(address=>uint) public addressToAmountFunded;

    uint public minimumUsd = 50*10**18 ;

    function fund() public payable{
        require(msg.value.getConversionRate(priceFeed) >= minimumUsd, "Not enough");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner{
        for(uint funderIndex = 0; funderIndex<funders.length; funderIndex++){
            address[] memory m_funders = funders;
            address funder = m_funders[funderIndex];
            addressToAmountFunded[funder]= 0;
            funders = new address[](0);
        }

        // function withdraw() public onlyOwner{ expesince
        // for(uint funderIndex = 0; funderIndex<funders.length; funderIndex++){
        //     address funder = funders[funderIndex];
        //     addressToAmountFunded[funder]= 0;
        //     funders = new address[](0);
        // }
        
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}(""); //tarnsferring funds
        require(callSuccess, "Send Failed");

        //(bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        //require(callSuccess, "callfailed")

    }
        
    
}
