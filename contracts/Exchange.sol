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
}