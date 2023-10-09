const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString() ,'ether')
}

describe('Token', () => {
    //We gonna write test inside this function
    let token,accounts, deployer, receiver
    beforeEach(async()=>{
        //Fetch Token from Blockchain
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy("Shafi Token", "SHAFI" , '1000000')

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        receiver = accounts[1]
    })

    describe('Deployment Phase', () => {

        let Name = "Shafi Token";
        let Symbol = "SHAFI";
        let Decimals = "18";
        let totalSupply = tokens(1000000);
        
        it('has correct name', async()=> {
            //check the name is correct
            expect(await token.name()).to.equal(Name)
    
        }) 
        it('has correct symbol', async()=> { 
            //check the symbol is correct
            expect(await token.symbol()).to.equal(Symbol)
    
        })
        it('has correct decimals', async()=> { 
            //check the decimals is correct
            expect(await token.decimals()).to.equal(Decimals)
    
        })
        it('has correct total supply', async()=> { 
            //const value = ethers.utils.parseUnits('1000000', 'ether')
            expect(await token.totalSupply()).to.equal(totalSupply)
    
        })
        it('assign total supply to deployer ', async()=> { 
            //const value = ethers.utils.parseUnits('1000000', 'ether')
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
    
        })
    })

    describe('Sending Token',() => {
        let amount 

        beforeEach(async()=>{
            amount = tokens(100)
            let transaction = await token.connect(deployer).transfer(receiver.address, amount)
            let result = transaction.wait() 
        })

        it('Transfers token balances', async()=>{          
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
            expect(await token.balanceOf(receiver.address)).to.equal(amount)    
        })
    })
})