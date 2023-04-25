const { network } = require("hardhat");
const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const{verify} = require("../utils/verify")
require("dotenv").config();

module.exports = async({getNamedAccounts, deployments})=>{
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId 

    
    // const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    let ethUsdPriceFeedAddress 
    if(developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }
    else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    
    


    const fundMe = await deploy("FundMe",{
        contract: "FundMe",
        from: deployer,
        args:[ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API)
    {
     await verify(fundMe.address,[ethUsdPriceFeedAddress]) //verify contract is in utils folder
    }
    
}
module.exports.tags = ["all", "fundme"]
