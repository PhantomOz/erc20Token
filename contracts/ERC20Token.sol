// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ERC20Token {
    string private s_name;
    string private s_symbol;
    uint256 private s_totalSupply;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        s_name = _name;
        s_symbol = _symbol;
        i_totalSupply = _totalSupply;
    }
}
