import { useSelector } from "react-redux";
import { myOrderSelector } from "../store/selectors";
import sort from '../assets/sort.svg'
import Banner from "./Banner";
const Transactions = () => {

    const myOpenOrders = useSelector(myOrderSelector)
    const symbols = useSelector(state => state.tokens.symbols)

    return (
      <div className="component exchange__transactions">
        <div>
          <div className='component__header flex-between'>
            <h2>My Orders</h2>
  
            <div className='tabs'>
              <button className='tab tab--active'>Orders</button>
              <button className='tab'>Trades</button>
            </div>
          </div>


          {!myOpenOrders || myOpenOrders.length === 0 ? (
            <Banner text = "No Open Orders"/>  
          ):(
            <table>
              <thead>
                <tr>
                <th>{symbols && symbols[0]}<img src={sort} alt="Sort"></img></th>
                <th>{symbols && symbols[0]}/{symbols && symbols[1]}<img src={sort} alt="Sort"></img></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myOpenOrders && myOpenOrders.map((order,index) =>
                    <tr key={index}>
                    <td style={{color: `${order.orderTypeClass}`}}>{order.token0Amount}</td>
                    <td>{order.tokenPrice}</td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
            
  
        </div>
  
        {/* <div> */}
          {/* <div className='component__header flex-between'> */}
            {/* <h2>My Transactions</h2> */}
  
            {/* <div className='tabs'> */}
              {/* <button className='tab tab--active'>Orders</button> */}
              {/* <button className='tab'>Trades</button> */}
            {/* </div> */}
          {/* </div> */}
  
          {/* <table> */}
            {/* <thead> */}
              {/* <tr> */}
                {/* <th></th> */}
                {/* <th></th> */}
                {/* <th></th> */}
              {/* </tr> */}
            {/* </thead> */}
            {/* <tbody> */}
  
              {/* <tr> */}
                {/* <td></td> */}
                {/* <td></td> */}
                {/* <td></td> */}
              {/* </tr> */}
  
            {/* </tbody> */}
          {/* </table> */}
  
        {/* </div> */}
      </div>
    )
  }
  
  export default Transactions;