import { useEffect } from 'react';
import config from '../config.json';
import { useDispatch } from 'react-redux';
import { loadProvider, loadNetwork, 
  loadAccount, loadToken } from '../store/interactions';


                

function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async() => {
    const account = await loadAccount(dispatch)

    //making connection to the blockchain provider
    const provider = loadProvider(dispatch)
    //Accessing the network connected
    const chainId = await loadNetwork(provider,dispatch)

    //Accessing the smart Contract so that we can use it in js file
    await loadToken(provider, config[chainId].DApp.address, dispatch)
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
