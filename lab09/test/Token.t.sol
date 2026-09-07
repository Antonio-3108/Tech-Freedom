// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Token} from "../src/Token.sol";

contract TokenTest is Test {
    Token token;

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
    }

    function test_transfer_sends_fee() public {
        uint256 amount = 100 ether;
        uint256 expectedFee = 1 ether;
        uint256 expectedReceived = 99 ether;

        vm.startPrank(owner);

        token.transfer(alice, amount);

        vm.stopPrank();

        assertEq(token.balanceOf(alice), expectedReceived);
        assertEq(token.balanceOf(feeRecipient), expectedFee);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - amount);
    }

    function test_initial_supply() public {
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY);
    }

    function test_token_metadata() public {
        assertEq(token.name(), "Tech Freedom Token");
        assertEq(token.symbol(), "TFT");
        assertEq(token.decimals(), 18);
    }

        function testFuzz_transfer_fee(uint256 amount) public {
        amount = bound(amount, 100, 1_000 ether);

        vm.startPrank(owner);

        token.transfer(alice, amount);

        vm.stopPrank();

        uint256 expectedFee =
            (amount * token.FEE_BPS()) / token.BPS_DENOMINATOR();

        uint256 expectedReceived = amount - expectedFee;

        assertEq(token.balanceOf(alice), expectedReceived);
        assertEq(token.balanceOf(feeRecipient), expectedFee);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - amount);
    }
}