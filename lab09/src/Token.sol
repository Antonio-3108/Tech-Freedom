// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    uint256 public constant FEE_BPS = 100; // 1% = 100 basis points
    uint256 public constant BPS_DENOMINATOR = 10_000;

    address public immutable feeRecipient;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        address feeRecipient_
    ) ERC20(name_, symbol_) {
        require(feeRecipient_ != address(0), "Invalid fee recipient");

        feeRecipient = feeRecipient_;
        _mint(msg.sender, initialSupply_);
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        // Do not charge fees on minting or burning.
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        uint256 fee = (amount * FEE_BPS) / BPS_DENOMINATOR;
        uint256 amountAfterFee = amount - fee;

        super._update(from, to, amountAfterFee);

        if (fee > 0) {
            super._update(from, feeRecipient, fee);
        }
    }
}
