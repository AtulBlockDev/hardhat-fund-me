const { assert, expect } = require("chai")
const{deployments, ethers, getNamedAccounts} = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name) ? describe.skip
:describe("FundMe", async function(){

  let fundMe
  let mockV3aggregator
  let deployer
  const sendValue = ethers.utils.parseEther("1")

beforeEach(async function() {

  deployer = (await getNamedAccounts()).deployer
  await deployments.fixture("all") //confused
  fundMe = await ethers.getContract("FundMe",  deployer)
  mockV3aggregator = await ethers.getContract("MockV3Aggregator", deployer)

})

describe ("constructor",  async function(){
  it("sets the aggregator correctly", async function(){
    const response = await fundMe.priceFeed()
    assert.equal(response, mockV3aggregator.address)
  })
})

  describe("fund", async function(){
    it("fails to send enough ether",  async function(){
      await expect(fundMe.fund()).to.be.revertedWith("Not enough")

  })

  it("updates the amount funded data structure", async function(){
    await fundMe.fund({value: sendValue})
    const response = await fundMe.addressToAmountFunded(deployer)
    assert.equal(response.toString(), sendValue.toString())
  })

  it("updates funders array with the funders address",  async function(){
    await fundMe.fund({value: sendValue})
    const funder = await fundMe.funders(0)
    assert.equal(funder, deployer)
  })

})

describe("withdraw", async function(){

  beforeEach(async function(){
    await fundMe.fund({value: sendValue})
  })
  it("Withdraw eth from a single funder", async function(){
    const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
    const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
  
  const transactionResponse = await fundMe.withdraw()
  const transactionReceipt = await transactionResponse.wait(1)
  const{gasUsed, effectiveGasPrice} = transactionReceipt
  const gasCost = gasUsed.mul(effectiveGasPrice)
  const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
  const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

  assert.equal(endingFundMeBalance, 0)
  assert.equal(endingDeployerBalance.add(gasCost).toString(), startingFundMeBalance.add(startingDeployerBalance).toString())


  })
  it("withdraw eth for multiple funders", async function(){
    const accounts = await ethers.getSigners()
    for(i =1; i>6; i++){

      const fundMeConnectedContract = await fundMe.connect(accounts(i))
      fundMeConnectedContract.fund({value: sendValue})
    }
    
    const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
    const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

    const transactionResponse = await fundMe.withdraw()
    const transactionReceipt = await transactionResponse.wait(1)
    const{gasUsed, effectiveGasPrice} = transactionReceipt
    const gasCost = gasUsed.mul(effectiveGasPrice)

    const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
    const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

    assert.equal(endingFundMeBalance, 0)
    assert.equal(endingDeployerBalance.add(gasCost).toString(), startingFundMeBalance.add(startingDeployerBalance).toString())
    

    await expect(fundMe.funders(0)).to.be.reverted

    for( i=1; i>6; i++){
      assert.equal(fundMe.addressToAmountFunded(accounts(i).address),0)
    }
    
  })

  it("Only allows owner to withdraw", async function(){
    const accounts  = await ethers.getSigners()
    const attackerConnectedaccount = await fundMe.connect(accounts[1])
    await expect(attackerConnectedaccount.withdraw()).to.be.revertedWith("FundMe_NotOwner")

  })
  



})



})





