// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ERC20Token {
    string private s_name;
    string private s_symbol;
    uint256 private s_totalSupply;
    mapping(address => uint256) private s_balances;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        s_name = _name;
        s_symbol = _symbol;
        i_totalSupply = _totalSupply;
    }

    function name() public view returns (string memory) {
        return s_name;
    }

    function symbol() public view returns (string memory) {
        return s_symbol;
    }

    function totalSupply() public view returns (uint256) {
        return i_totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        balance = s_balances[_owner];
    }

    function transfer(address _to, uint256 _amount) public {
        uint256 previousBalances = balanceOf(msg.sender) + balanceOf(_to);
        s_balances[msg.sender] -= _amount;
        s_balances[_to] += _amount;
        require(balanceOf(msg.sender) + balanceOf(_to) == previousBalances);
    }
}
