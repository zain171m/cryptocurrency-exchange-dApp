import { useEffect } from 'react';
import config from '../config.json';
import { useDispatch } from 'react-redux';
import { loadProvider, loadNetwork, 
  loadAccount, loadTokens, loadExchange } from '../store/interactions';

import Navbar from './Navbar'
                

function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async() => {

    //making connection to the blockchain provider
    const provider = loadProvider(dispatch)

    //Accessing the chianId of current network connected
    const chainId = await loadNetwork(provider,dispatch)

    //Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })


    //Fetch current account and balace from Metamask
    window.ethereum.on('accountsChanged', async()=>{
      await loadAccount(provider, dispatch)
    })
    //await loadAccount(provider, dispatch)

    //Accessing the Token smart Contract so that we can use it in js file
    const DApp = config[chainId].DApp
    const mEth = config[chainId].mETH
    await loadTokens(provider, [DApp.address, mEth.address], dispatch)

    //Load exchange Smart Contract
    const exchangeConfig = config[chainId].exchange
    await loadExchange(provider, exchangeConfig.address, dispatch)
  }
  
  useEffect(() => {
    loadBlockchainData()
  })

  return (
    <div>

      <Navbar/>

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
