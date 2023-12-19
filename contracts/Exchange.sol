// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    uint256 public orderCount;// initially 0

    mapping(address => mapping(address => uint256)) public tokens;

    mapping(uint256 => _Order) public orders;

    mapping(uint256 => bool) public canceledOrder; //default false

    mapping(uint256 => bool) public filledOrder; 

    event Deposit(
    address indexed token,
    address indexed user, 
    uint256 amount,
    uint256 balance
    );

    event Withdraw(
    address indexed token,
    address indexed user, 
    uint256 amount,
    uint256 balance
    );

    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp,
        address creator
    );



    struct _Order {
        // Attributes of an order
        uint256 id; // Unique identifier for order
        address user; // User who made order
        address tokenGet; // Address of the token they receive
        uint256 amountGet; // Amount they receive
        address tokenGive; // Address of token they give
        uint256 amountGive; // Amount they give
        uint256 timestamp; // When order was created
    }

    constructor(address _feeAccount, uint256 _feePercent){
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    //Deposit Tokens

    function depositToken(address _token, uint256 _amount)
     public 
     {
        //Transfer tokens to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount), 'Error in transferFrom function');
        //Update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
        //Emit an Deposit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount)
    public
    {
        //check weather the user have sufficient balance already to withdraw
        require(tokens[_token][msg.sender] >= _amount);
        //Transfer tokens back to the user from exchange
        require(Token(_token).transfer(msg.sender, _amount), 'Error in transfer function');
        //Update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
        //Emit a withdraw event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //Check Balance
    function balanceOf(address _user, address _token) 
    public
    view
    returns(uint256)
    {
        return tokens[_token][_user];
    }


    function makeOrder(address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive) public
    {

        require(balanceOf(msg.sender, tokenGive) >= amountGive);
        orderCount = orderCount + 1;
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            tokenGet,
            amountGet,
            tokenGive,
            amountGive,
            block.timestamp
        );

        emit Order(
            orderCount,
            msg.sender,
            tokenGet,
            amountGet,
            tokenGive,
            amountGive,
            block.timestamp
        );
    }

    function cancelOrder(uint _id) public
    {
        //fetch the order
        _Order storage _order = orders[_id];
        //confirm the user
        require(_order.user == msg.sender);
        //confirm the order exist
        require(_order.id == _id);
        //cancel the order
        canceledOrder[_id] = true;
        //emit the event
        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }


function fillOrder(uint256 _id) public {
        // 1. Must be valid orderId
        require(_id > 0 && _id <= orderCount, "Order does not exist");
        // 2. Order can't be filled
        require(!filledOrder[_id]);
        // 3. Order can't be cancelled
        require(!canceledOrder[_id]);

        // Fetch order
        _Order storage _order = orders[_id];

        // Execute the trade
        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive
        );

        // Mark order as filled
        filledOrder[_order.id] = true;
    }

    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {
        // Fee is paid by the user who filled the order (msg.sender)
        // Fee is deducted from _amountGet
        uint256 _feeAmount = (_amountGet * feePercent) / 100;

        // Execute the trade
        // msg.sender is the user who filled the order, while _user is who created the order
        tokens[_tokenGet][msg.sender] =
            tokens[_tokenGet][msg.sender] -
            (_amountGet + _feeAmount);

        tokens[_tokenGet][_user] = tokens[_tokenGet][_user] + _amountGet;

        // Charge fees
        tokens[_tokenGet][feeAccount] =
            tokens[_tokenGet][feeAccount] +
            _feeAmount;

        tokens[_tokenGive][_user] = tokens[_tokenGive][_user] - _amountGive;
        tokens[_tokenGive][msg.sender] =
            tokens[_tokenGive][msg.sender] +
            _amountGive;

        // Emit trade event
        emit Trade(
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp,
            _user
        );
    }


}