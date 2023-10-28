import { ethers } from 'ethers';
import { useEffect } from 'react';
import Token_Abi from '../abis/Token.json'
import config from '../config.json'
import '../App.css';
                

function App() {

  const loadBlockchainData = async() => {
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    console.log(accounts[0])

    //making connection to the blockchain provider
    const provider = new ethers.providers.Web3Provider( window.ethereum )
    
    //Accessing the network connected
    const { chainId } = await provider.getNetwork()
    console.log(chainId)

    //Accessing the smart Contract so that we can use it in js file
    const token = new ethers.Contract( config[chainId].DApp.address , Token_Abi , provider )
    console.log(token.address)
    const symbol = await token.symbol()
    console.log(symbol)
  }
  
  useEffect(() => {
    loadBlockchainData()
  })

  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
