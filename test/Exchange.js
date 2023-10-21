const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString() ,'ether')
}

describe('Exchange', () => {
    let deployer, feeAccount, exchange

    const feePercent = 10 
    beforeEach(async()=>{

        const Exchange = await ethers.getContractFactory('Exchange')
        const Token = await ethers.getContractFactory('Token')

        token1 = await Token.deploy("Shafi Token", "SHAFI", '1000000')
        token2 = await Token.deploy("Boota Token", "BOOTA", '1000000')

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        feeAccount = accounts[1]

        user1 = accounts[2]
        user2 = accounts[3]

        //transfer tokens to user1
        let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100))
        //Fetch Token from Blockchain
        exchange = await Exchange.deploy(feeAccount.address, feePercent)

    })

    describe('Deployment', () => {        
        it('tracks the fee Account', async()=> {
            expect(await exchange.feeAccount()).to.equal(feeAccount.address)
        }) 

        it('tracks the fee Percent', async()=> {
            expect(await exchange.feePercent()).to.equal(feePercent)
        })
    })
    describe('Depositing Tokens', () => { 
        let transaction, result
        let amount = tokens(10) 
        describe('Success', () => {
            beforeEach( async() => {        
                //Approve Token
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait()
                //Deposit Token
                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait()
            })
            it('Tracks the token deposit', async() => {
                expect(await token1.balanceOf(exchange.address)).to.equal(amount)
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(amount)
                expect(await exchange.balanceOf(user1.address, token1.address)).to.equal(amount)
            })
            it('emits a transfer event', async() => {
                const event = result.events[1]
                expect(event.event).to.equal('Deposit')
                const args = event.args
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(await token1.balanceOf(exchange.address)).to.equal(amount)
            })

        })

        describe('Failure', () => {
            it('Fails when token is not approved', async() => {
                await expect(exchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted
            })

        })
    })

     describe('Withdrawing Tokens', () => { 
        let transaction, result
        let amount = tokens(10) 
        describe('Success', () => {
            beforeEach( async() => {        
                //Approve Token
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait()
                //Deposit Token
                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait()
                //Withdrawing tokens
                transaction = await exchange.connect(user1).withdrawToken(token1.address, amount)
                result = await transaction.wait()
            })
            it('Tracks the token withdraws', async() => {
                expect(await token1.balanceOf(exchange.address)).to.equal(0)
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(0)
                expect(await exchange.balanceOf(user1.address, token1.address)).to.equal(0)
            })
            it('emits a transfer event', async() => {
                const event = result.events[1]
                expect(event.event).to.equal('Withdraw')
                const args = event.args
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(await token1.balanceOf(exchange.address)).to.equal(0)
            })

        })

        describe('Failure', () => {
            it('Fails when withdrawing tokens without depositing', async() => {
                await expect (exchange.connect(user1).withdrawToken(token1.address, amount)).to.be.reverted
            })

        })
    })

    describe('Checking Balances', () => { 
        let transaction, result
        let amount = tokens(10) 
        
            beforeEach( async() => {        
                //Approve Token
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait()
                //Deposit Token
                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait()
            })
            it('Tracks the token balances', async() => {
                expect(await exchange.balanceOf(user1.address, token1.address)).to.equal(amount)
            })
    })

    describe('Making orders', async () => {
        let transaction, result
    
        let amount = tokens(1)
    
        describe('Success', () => {
          beforeEach(async () => {
            // Deposit tokens before making order
    
            // Approve Token
            transaction = await token1.connect(user1).approve(exchange.address, amount)
            result = await transaction.wait()
            // Deposit token
            transaction = await exchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait()
    
            // Make order
            transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount)
            result = await transaction.wait()
          })
    
          it('tracks the newly created order', async () => {
            console.log(exchange.orderCount())
            expect(await exchange.orderCount()).to.equal(1)
          })
    
          it('emits an Order event', async () => {
            const event = result.events[0]
            expect(event.event).to.equal('Order')
    
            const args = event.args
            expect(args.id).to.equal(1)
            expect(args.user).to.equal(user1.address)
            expect(args.tokenGet).to.equal(token2.address)
            expect(args.amountGet).to.equal(amount)
            expect(args.tokenGive).to.equal(token1.address)
            expect(args.amountGive).to.equal(amount)
            expect(args.timestamp).to.at.least(1)
          })

    
        })
    
        describe('Failure', () => {
          it('Rejects with no balance', async () => {
            await expect(exchange.connect(user1).makeOrder(token2.address, tokens(1), token1.address, tokens(1))).to.be.reverted
          })
        })
    })

    describe('Order actions', () => {
        describe('Cancel orders', () => {
            let transaction, result  
            let amount = tokens(1)
            describe('Success', () => {
                beforeEach(async () => {
                    // Deposit tokens before making order
                    // Approve Token
                    transaction = await token1.connect(user1).approve(exchange.address, amount)
                    result = await transaction.wait()
                    // Deposit token
                    transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                    result = await transaction.wait()
            
                    // Make order
                    transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount)
                    result = await transaction.wait()

                    //Cancel order
                    transaction = await exchange.connect(user1).cancelOrder(1)
                    result = await transaction.wait()
                })
                it('Updates canceled order', async () => {
                    expect( await exchange.canceledOrder(1)).to.equal(true)
                })
                it('emits an Order event', async () => {
                    const event = result.events[0]
                    expect(event.event).to.equal('Cancel')
                    const args = event.args
                    expect(args.id).to.equal(1)
                    expect(args.user).to.equal(user1.address)
                    expect(args.tokenGet).to.equal(token2.address)
                    expect(args.amountGet).to.equal(amount)
                    expect(args.tokenGive).to.equal(token1.address)
                    expect(args.amountGive).to.equal(amount)
                    expect(args.timestamp).to.at.least(1)
                  })
            })
            describe('Failure',() => {
                beforeEach(async () => {
                    // Deposit tokens before making order
                    // Approve Token
                    transaction = await token1.connect(user1).approve(exchange.address, amount)
                    result = await transaction.wait()
                    // Deposit token
                    transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                    result = await transaction.wait()
                })
                it('Rejects invalid order id', async () => {
                    await expect(exchange.connect(user1).cancelOrder(9999)).to.be.reverted
                })
                it('Rejects unauthorized cancelation', async () => {
                    await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted
                })
            })
        })
    })
    
})

