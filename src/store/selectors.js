import { createSelector } from "reselect";
import { get, groupBy, reject, minBy, maxBy} from "lodash";
import { ethers } from "ethers";
import moment from "moment";

const GREEN = '#25CE8F'
const RED = '#F45353'


const tokens = state => get(state, 'tokens.contracts')
const allOrders = state => get(state, 'exchange.allOrders.data', [])
const filledOrders = state => get(state, 'exchange.allFilledOrders.data', [])
const cancelledOrders = state => get(state, 'exchange.allCancelledOrders.data', [])
const account  = state => get(state, 'provider.account')


const openOrders = state => {
    const all = allOrders(state)
    const filled = filledOrders(state)
    const cancelled = cancelledOrders(state)

    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some((o) => o.id.toString() === order.id.toString()) 
        const orderCancelled = cancelled.some((o)=> o.id.toString() === order.id.toString())
        return orderFilled || orderCancelled
    })

    return openOrders
}

const decorateOrder = (order, tokens) => {
    let token0Amount, token1Amount
    
    // tokens[0] = Dapp and tokens[1] = mEth or mDie
    //Giving mEth in exchange of DAPP
    if(order.tokenGive === tokens[1].address){
        token0Amount  = order.amountGive // amount of DApp we are giving
        token1Amount = order.amountGet // amount of mEth we want....
    }
    else{
        token0Amount  = order.amountGet // amount of DApp we want
        token1Amount = order.amountGive // amount of mEth we are giving
    }

    const precision =  100000
    let tokenPrice = (token1Amount / token0Amount)
    tokenPrice = Math.round(tokenPrice* precision)/precision



    return({
        ...order,
        token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
        token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D')
    })
}


// -----------------------------------------------------------------------------------------------------------------
// ------------------------------------------------My FILLED ORDERS-------------------------------------------------


export const myFilledOrdersSelector = createSelector(filledOrders, account, tokens, (orders,account,tokens) => {

    if(!tokens[0] || !tokens[1]) { return }
    //Filters orders by the user owned orders
    orders = orders.filter((o) => o.user === account || o.creator === account)

    //Filters orders by selected market
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    // sort orders in ascending orders.. [X]
    // decorate orders, add color class.. [X]
    // sort orders in descending order..

    orders = orders.sort((a, b) => a.timestamp - b.timestamp)

    orders = decorateMyFilledOrders(orders,account, tokens)
    
    orders = orders.sort((a, b) => b.timestamp - a.timestamp)

    return orders

})


const decorateMyFilledOrders = (orders,account, tokens)=>{
    return (orders.map((order)=>{
        //decorate each order
        order = decorateOrder(order, tokens)
        order = decorateMyFilledOrder(order, account,tokens)
        return order
    }))    
}


const decorateMyFilledOrder = (order ,account, tokens)=>{
    const myOrder = order.creator === account

    let orderType
    if (myOrder){
        orderType = order.tokenGive === tokens[0].addess ? 'sell': 'buy'
    }else{
        orderType = order.tokenGive === tokens[0].addess ? 'buy': 'sell'
    }

    return({
        ...order,
        orderType,
        orderClass: (orderType === 'buy' ? GREEN : RED),
        orderSign: (orderType === 'buy' ? '+' : '-')
    })
}


// -----------------------------------------------------------------------------------------------------------------
// ------------------------------------------------FILLED ORDERS----------------------------------------------------


export const filledOrdersSelector = createSelector(filledOrders, tokens, (orders, tokens) => {

    if(!tokens[0] || !tokens[1]) { return }
    //Filters orders by selected market
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    // sort orders in ascending orders.. [X]
    // decorate orders, add color class.. [X]
    // sort orders in descending order..

    orders = orders.sort((a, b) => a.timestamp - b.timestamp)

    orders = decorateFilledOrders(orders, tokens)
    
    orders = orders.sort((a, b) => b.timestamp - a.timestamp)
    return orders

})


const decorateFilledOrders = (orders, tokens)=>{
    let previousOrder = orders[0]

    return (orders.map((order)=>{
        //decorate each order
        order = decorateOrder(order, tokens)
        order = decorateFilledOrder(order, previousOrder)
        previousOrder = order
        return order
    }))    
}


const decorateFilledOrder = (order ,previousOrder)=>{
    return({
        ...order,
        tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
    })
}

const tokenPriceClass = (tokenPrice, orderId, previousOrder)=>{
    if (previousOrder.id === orderId)
    {
        return GREEN
    }

    if(previousOrder.tokenPrice <= tokenPrice){
        return GREEN
    }
    else{
        return RED
    }
}

// -----------------------------------------------------------------------------------------------------------
// ---------------------------------------------MY OPEN ORDERS------------------------------------------------

export const myOrderSelector = createSelector(openOrders, account, tokens, (orders,account, tokens) => {
    if(!tokens[0] || !tokens[1]) { return }
    //Filters orders by the user owned orders
    orders = orders.filter((o) => o.user === account)
    //Filters orders by selected market
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    orders = decorateMyOrders(orders, tokens)
    orders = orders.sort((a, b) => b.timestamp - a.timestamp)
    return orders
})

const decorateMyOrders = (orders, tokens) => {
    return(
        orders.map((order ) => {
            order  = decorateOrder(order, tokens)
            order = decorateMyOrder(order, tokens)
            return(order)
        })
    )
}

const decorateMyOrder = (order, tokens) => {
    const orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'
    return({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED)
    })
}




// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------ORDER BOOK--------------------------------------------------

export const orderBookSelector = createSelector(openOrders, tokens, (orders, tokens) => {

    if(!tokens[0] || !tokens[1]) { return }
    //Filters orders by selected market
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)


    // Decorate orders 
    orders = decorateOrderBookOrders(orders, tokens)

    orders = groupBy(orders, 'orderType')

    const buyOrders = get(orders, 'buy', [])
    const sellOrders = get(orders, 'sell', [])

    orders = {
        ...orders,
        buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice),
        sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    }
    return orders
})

const decorateOrderBookOrders = (orders, tokens) => {
    return(
        orders.map((order ) => {
            order  = decorateOrder(order, tokens)
            order = decorateOrderBookOrder(order, tokens)
            return(order)
        })
    )
}

const decorateOrderBookOrder = (order, tokens) =>{
    const orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'
    return({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillAction: (orderType === 'buy' ? 'sell' : 'buy')
    })
}

/*

export const priceChartSelector = createSelector(filledOrders, tokens, (orders, tokens) => {

    if(!tokens[0] || !tokens[1]) { return }

    //Filters orders by selected market
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    orders = orders.sort((a,b) => a.timestamp - b.timestamp)
    
    orders = orders.map((o) => decorateOrder(o, tokens))
    
    const data =  ({
        series: ({
            data: buildGraphData(orders)
        })
    })

    if (data){
        return data
    }
})

const buildGraphData = (orders)=>{
    orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())
    
    const hours = Object.keys(orders)

    const graphData = hours.map((hour) =>{
        //fetch all orders from current hour already sorted by timestamp
        const group = orders[hour]
        
        //Calculate price values: open, high, low, close
        const open = group[0]   //first order will be open 
        const high = maxBy(group, 'tokenPrice') //highest order
        const low = minBy(group, 'tokenPrice') //lowest order
        const close = group[group.length - 1] //last order
        return(
            {
                x: new Date(hour),
                y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
              }
        )
    })
    return graphData
}

*/

// ----------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------PRICE CHART---------------------------------------------

export const priceChartSelector = createSelector(
    filledOrders,
    tokens,
    (orders, tokens) => {
      if (!tokens[0] || !tokens[1]) { return }
  
      // Filter orders by selected tokens
      orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
      orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
  
      // Sort orders by date ascending to compare history
      orders = orders.sort((a, b) => a.timestamp - b.timestamp)
  
      // Decorate orders - add display attributes
      orders = orders.map((o) => decorateOrder(o, tokens))
  
      // Get last 2 order for final price & price change
      let secondLastOrder, lastOrder
      [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)
  
      // get last order price
      const lastPrice = get(lastOrder, 'tokenPrice', 0)
  
      // get second last order price
      const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

      
      if (orders) {
      return ({
        lastPrice,
        lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
        series: [{
          data: buildGraphData(orders)
        }]
      })
    }
  
    }
  )
  
  const buildGraphData = (orders) => {
    // Group the orders by hour for the graph
    orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())
  
    // Get each hour where data exists
    const hours = Object.keys(orders)
  
    // Build the graph series
    const graphData = hours.map((hour) => {
      // Fetch all orders from current hour
      const group = orders[hour]
  
      // Calculate price values: open, high, low, close
      const open = group[0] // first order
      const high = maxBy(group, 'tokenPrice') // high price
      const low = minBy(group, 'tokenPrice') // low price
      const close = group[group.length - 1] // last order

      return({
        x: new Date(hour),
        y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
      })
    })
  
    return graphData
  }
  