// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Token} from "../src/Token.sol";

contract TokenHandler is Test {
    Token public token;

    address public owner;
    address public alice;
    address public bob;
    address public feeRecipient;

    constructor(
        Token token_,
        address owner_,
        address alice_,
        address bob_,
        address feeRecipient_
    ) {
        token = token_;
        owner = owner_;
        alice = alice_;
        bob = bob_;
        feeRecipient = feeRecipient_;
    }

    function transferFromOwner(
        uint256 amount,
        uint256 recipientIndex
    ) external {
        address recipient = recipientIndex % 2 == 0 ? alice : bob;

        uint256 ownerBalance = token.balanceOf(owner);

        if (ownerBalance == 0) {
            return;
        }

        amount = bound(amount, 1, ownerBalance);

        vm.prank(owner);
        token.transfer(recipient, amount);
    }

    function transferFromAlice(
        uint256 amount,
        uint256 recipientIndex
    ) external {
        address recipient = recipientIndex % 2 == 0 ? owner : bob;

        uint256 aliceBalance = token.balanceOf(alice);

        if (aliceBalance == 0) {
            return;
        }

        amount = bound(amount, 1, aliceBalance);

        vm.prank(alice);
        token.transfer(recipient, amount);
    }

    function transferFromBob(
        uint256 amount,
        uint256 recipientIndex
    ) external {
        address recipient = recipientIndex % 2 == 0 ? owner : alice;

        uint256 bobBalance = token.balanceOf(bob);

        if (bobBalance == 0) {
            return;
        }

        amount = bound(amount, 1, bobBalance);

        vm.prank(bob);
        token.transfer(recipient, amount);
    }
}

contract TokenInvariantTest is Test {
    Token token;
    TokenHandler handler;

    address owner = makeAddr("owner");
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address feeRecipient = makeAddr("feeRecipient");

    uint256 constant INITIAL_SUPPLY = 1_000_000 ether;

    function setUp() public {
        vm.prank(owner);

        token = new Token(
            "Tech Freedom Token",
            "TFT",
            INITIAL_SUPPLY,
            feeRecipient
        );

        handler = new TokenHandler(
            token,
            owner,
            alice,
            bob,
            feeRecipient
        );

        targetContract(address(handler));

        targetSender(address(this));
    }

    function invariant_totalSupplyNeverChanges() public {
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
    }

    function invariant_balancesEqualTotalSupply() public {
        uint256 totalBalances =
            token.balanceOf(owner)
            + token.balanceOf(alice)
            + token.balanceOf(bob)
            + token.balanceOf(feeRecipient);

        assertEq(totalBalances, token.totalSupply());
    }
}