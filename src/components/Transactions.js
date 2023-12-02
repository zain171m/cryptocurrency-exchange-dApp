import { useSelector } from "react-redux";
import { myOrderSelector } from "../store/selectors";
import sort from '../assets/sort.svg'
import Banner from "./Banner";
import { useRef, useState } from "react";
import { myFilledOrdersSelector } from "../store/selectors";
const Transactions = () => {

    const [showMyOrders, setShowMyOrders] = useState(true)
    const myOpenOrders = useSelector(myOrderSelector)
    const symbols = useSelector(state => state.tokens.symbols)
    const myFilledOrders = useSelector(myFilledOrdersSelector)

    const orderRef = useRef(null)
    const tradeRef = useRef(null)

    const tabHandler = (e)=>{
      if(e.target.className !== orderRef.current.className){
        e.target.className = "tab tab--active"
        orderRef.current.className = "tab" 
        setShowMyOrders(false)
      }else{
        e.target.className = "tab tab--active"
        tradeRef.current.className = "tab"
        setShowMyOrders(true)
      }
    }


    return (
      <div className="component exchange__transactions">
        {showMyOrders? (
          <div>
          <div className='component__header flex-between'>
            <h2>My Orders</h2>
  
            <div className='tabs'>
              <button  onClick = {tabHandler} ref = {orderRef} className='tab tab--active'>Orders</button>
              <button  onClick = {tabHandler} ref = {tradeRef} className='tab'>Trades</button>
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
  
        ):(
          <div>
          <div className='component__header flex-between'>
            <h2>My Transactions</h2>
          
            <div className='tabs'>
              <button onClick = {tabHandler} ref = {orderRef} className='tab tab--active'>Orders</button>
              <button onClick = {tabHandler} ref = {tradeRef} className='tab'>Trades</button>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
              <th>Time<img src={sort} alt = "Sort"></img></th>
              <th>{symbols && symbols[0]}<img src={sort} alt="Sort"></img></th>
              <th>{symbols && `${symbols[0]}/${symbols[1]}`}<img src={sort} alt="Sort"></img></th>
              </tr>
            </thead>
            <tbody>
            {myFilledOrders && myFilledOrders.map((order, index) => {
                return(
                <tr key={index}>
                <td>{order.formattedTimestamp}</td>
                <td style={{color: `${order.orderClass}`}}>{`${order.orderSign}${order.token1Amount}`}</td>
                <td>{order.tokenPrice}</td>
                </tr>
                )
            })}
            </tbody>
          </table>
        </div>
        )}
   
      </div>
    )
  }
  
  export default Transactions;