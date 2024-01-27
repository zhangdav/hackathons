// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "aave-v3-core/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {DeployStreamLine} from "../../script/DeployStreamLine.s.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {StreamLine} from "../../src/StreamLine.sol";
import {StreamVaults} from "../../src/StreamVaults.sol";
import {IPool} from "aave-v3-core/contracts/interfaces/IPool.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {MockPool} from "aave-v3-core/contracts/mocks/helpers/MockPool.sol";

contract StreamLineTest is Test {
    StreamLine public streamLine;
    IERC20 public daiToken;
    HelperConfig public helperConfig;
    StreamVaults public streamVaults;
    MockPool public mockPool;

    uint256 public constant STARTING_ERC20_BALANCE = 1000 ether;
    uint256 public constant AMOUNT_COLLATERAL = 10 ether;

    address public ghoIRS = 0x521247B4d0a51E71DE580dA2cBF99EB40a44b3Bf;
    address public daiIRS = 0xA813CC4d67821fbAcF24659e414A1Cf6c551373c;

    address public USER = makeAddr("user");

    address public linkUsdPriceFeed;
    address public daiUsdPriceFeed;
    address public ghoUsdPriceFeed;
    address public link;
    address public dai;
    address public gho;
    address public router;
    address public payFeesInLink;

    function setUp() public {
        DeployStreamLine deploy = new DeployStreamLine();
        (streamLine, streamVaults, helperConfig) = deploy.run();
        (linkUsdPriceFeed, daiUsdPriceFeed, ghoUsdPriceFeed, link, dai, gho, payFeesInLink,) =
            helperConfig.activeNetworkConfig();

        mockPool = new MockPool();
        ERC20Mock(dai).mint(USER, STARTING_ERC20_BALANCE);
    }

    /////////////////
    // Price Tests //
    /////////////////

    function testGetUsdValue() public {
        uint256 daiAmount = 10e18;
        uint256 expectedUsd = 10e18;
        uint256 actualUsd = streamLine._getUsdValue(dai, daiAmount);
        assertEq(expectedUsd, actualUsd);
    }

    ////////////////////
    // Modifers Tests //
    ////////////////////

    function testRevertIfCollateralZero() public {
        vm.startPrank(USER);
        ERC20Mock(dai).approve(address(streamLine), AMOUNT_COLLATERAL);

        vm.expectRevert(StreamLine.StreamLine__NeedsMoreThanZero.selector);
        streamLine.depositCollateral(dai, 0, 60);
        vm.stopPrank();
    }

    function testRevertsWithUnapprovedCollateral() public {
        ERC20Mock randToken = new ERC20Mock();
        vm.startPrank(USER);
        vm.expectRevert(abi.encodeWithSelector(StreamLine.StreamLine__TokenNotAllowed.selector, address(randToken)));
        streamLine.depositCollateral(address(randToken), 10e18, 60);
        vm.stopPrank();
    }

    ///////////////////////
    // Constructor Tests //
    ///////////////////////

    address[] public tokenAddresses;
    address[] public priceFeedAddresses;

    function testRevertsIfTokenLengthDoesntMatchPriceFeeds() public {
        tokenAddresses.push(dai);
        priceFeedAddresses.push(daiUsdPriceFeed);
        priceFeedAddresses.push(linkUsdPriceFeed);

        vm.expectRevert(StreamLine.StreamLine__TokenAddressesAndPriceFeedAddressesAmountsDontMatch.selector);
        new StreamLine(address(mockPool), gho, tokenAddresses, priceFeedAddresses, address(streamVaults), ghoIRS, daiIRS);
    }

    /////////////////////////////
    // depositCollateral Tests //
    /////////////////////////////

    modifier depositedCollateral() {
        vm.startPrank(USER);
        ERC20Mock(dai).approve(address(streamLine), AMOUNT_COLLATERAL);
        streamLine.depositCollateral(dai, AMOUNT_COLLATERAL, 60);
        vm.stopPrank();
        _;
    }

    function testDepositPeriodForUser() public depositedCollateral {
        vm.startPrank(USER);
        uint256 expectDepositPeriodForUser = 60;
        uint256 actualDepositPeriodForUser = streamLine.getDepositPeriodForUser(USER, 1);
        assert(expectDepositPeriodForUser == actualDepositPeriodForUser);
        vm.stopPrank();
    }

    function testTokenDeposit() public depositedCollateral {
        vm.startPrank(USER);
        uint256 expectDepositBalance = AMOUNT_COLLATERAL;
        uint256 actualDepositBalance = streamLine.getUserDepositAmount(USER, dai);
        assert(expectDepositBalance == actualDepositBalance);
        vm.stopPrank();
    }

    function testCurrentDepositId() public depositedCollateral {
        vm.startPrank(USER);
        uint256 expectCurrentDepositId = 2;
        uint256 actualCurrentDepositId = streamLine.getDepositId(USER);
        assert(expectCurrentDepositId == actualCurrentDepositId);
        vm.stopPrank();
    }
}
