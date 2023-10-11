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
        let amount, transaction, result
        describe('Success',() => {
            beforeEach(async()=>{
                amount = tokens(100)
                transaction = await token.connect(deployer).transfer(receiver.address, amount)
                result = await transaction.wait() 
            })

            it('transfers token balances', async()=>{          
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)    
            })

            it('emits a transfer event', async() => {
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')
                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects insufficient balances', async()=>{
                //Transfer more tokens than deployer has -10M
                const invalidAmount = tokens(100000000)
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted

            })

            it('has valid recipient', async()=>{
                //Transfer more tokens than deployer has -10M
                const amount = tokens(100)
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000' , amount)).to.be.reverted              
            })
        })

    })
})