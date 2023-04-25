// SPDX-License-Identifier: MLT

pragma solidity 0.8.7;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter{

function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256){
        
         (,int256 answer,,,) = priceFeed.latestRoundData();
         return uint(answer*1e10);

    }
    function getConversionRate(uint ethAmount,AggregatorV3Interface priceFeed) internal view returns(uint){
        uint ethPrice = getPrice(priceFeed);
        uint ethAmountInUsd = (ethPrice*ethAmount/1e18);
        return ethAmountInUsd;
    }
}