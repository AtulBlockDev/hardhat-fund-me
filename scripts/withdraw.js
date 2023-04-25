const{deployments, ethers, getNamedAccounts} = require("hardhat")

async function main(){
     const {deployer} = await getNamedAccounts()
    fundMe = await ethers.getContract("FundMe",  deployer) // picks the recently deployed contrac t
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("withdrawn!")
}


main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})