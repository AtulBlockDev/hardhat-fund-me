const{deployments, ethers, getNamedAccounts} = require("hardhat")

async function main(){
     const {deployer} = await getNamedAccounts()
    fundMe = await ethers.getContract("FundMe",  deployer)
    const transactionResponse = await fundMe.fund({value: ethers.utils.parseEther("5")})
    await transactionResponse.wait(1)
    console.log("funded")
}


main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})




