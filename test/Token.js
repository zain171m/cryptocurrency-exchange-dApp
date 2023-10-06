const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString() ,'ether')
}

describe('Token', () => {
    //We gonna write test inside this function
    let token

    beforeEach(async()=>{
        //Fetch Token from Blockchain
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy("Shafi Token", "SHAFI" , '1000000')
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
    })
})