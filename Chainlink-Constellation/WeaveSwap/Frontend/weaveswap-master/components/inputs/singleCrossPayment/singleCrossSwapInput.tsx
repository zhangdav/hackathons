import React, { useState, useEffect } from "react";
import TokensDropdown from "../../dropdown/tokensDropdown";
import styles from "./singleswap.module.css";
import {
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import {
  Polygon_Mumbai_SourceChainSender,
  Mumbai_Approve_contract,
  Eth_Sepolia_DestChainReceiver,
  Sepolia_Approve_contract,
  Sepolia_to_mumbai_DestChainReceiver,
  Optimism_to_Eth_Sepolia_DestChainReceiver,
  Optimism_Approve_contract,
  Sepolia_to_mumbai_SourceChainSender,
  Optimism_to_Eth_Sepolia_SourceChainSender,
  BSC_Testnet_to_Eth_Sepolia_DestChainReceiver,
  BSC_Testnet_to_Eth_Sepolia_SourceChainSender,
  BSC_Testnet_Approve_contract,
  Base_Goerli_to_Eth_Sepolia_DestChainReceiver,
  Base_Goerli_to_Eth_Sepolia_SourceChainSender,
  Base_Goerli_Approve_contract,
  Avalanche_Fuji_to_Eth_Sepolia_DestChainReceiver,
  Avalanche_Fuji_to_Eth_Sepolia_SourceChainSender,
  Avalanche_Fuji_Approve_contract,
} from "@/constants/address";
import { useAddress } from "@thirdweb-dev/react";
import ApproveModalPage from "@/components/modal/approve/approveModal";
import { Tooltip } from "flowbite-react";
import { useSelector } from "react-redux";
import { selectActiveChain } from "@/redux/features/activeChain";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SingleCrossSwapInput() {
  // Check if the code is running on the client side
  const isClient = typeof window !== "undefined";
  const [formattedNumber, setFormattedNumber] = useState<number | undefined>(
    undefined
  );
  const [getFunderBalanceNumber, setGetFunderBalanceNumber] = useState<
    number | undefined
  >(undefined);
  const [amount, setAmount] = useState<number>();
  const [_value, setValue] = useState(0.0);
  const [destinationState, setDestinationState] = useState("");
  const [chainReceiver, setChainReceiver] = useState("");
  const [allowanceCheckContract, setAllowanceCheckContract] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [checkSourceChain, setCheckSourceChain] = useState("");
  const [activeChainState, setActiveChainState] = useState("");
  const [loading, setLoading] = useState(false);

  const address = useAddress();
  const _owner = address;
  const funder = address;

  const activeChain = useSelector(selectActiveChain);
  const secondChain = isClient ? localStorage.getItem("secondChain") : "";

  useEffect(() => {
    if (
      activeChain?.name?.includes("mumbai") &&
      secondChain?.includes("sepolia")
    ) {
      setDestinationState("16015286601757825753");
      setChainReceiver(Eth_Sepolia_DestChainReceiver);
      setCheckSourceChain(Polygon_Mumbai_SourceChainSender);
      setAllowanceCheckContract(Mumbai_Approve_contract);
    } else if (
      activeChain?.name?.includes("sepolia") &&
      secondChain?.includes("mumbai")
    ) {
      setDestinationState("12532609583862916517");
      setChainReceiver(Sepolia_to_mumbai_DestChainReceiver);
      setCheckSourceChain(Sepolia_to_mumbai_SourceChainSender);
      setAllowanceCheckContract(Sepolia_Approve_contract);
    } else if (
      activeChain?.name?.includes("Optimism Goerli Testnet") &&
      secondChain?.includes("Sepolia")
    ) {
      setDestinationState("16015286601757825753");
      setChainReceiver(Optimism_to_Eth_Sepolia_DestChainReceiver);
      setCheckSourceChain(Optimism_to_Eth_Sepolia_SourceChainSender);
      setAllowanceCheckContract(Optimism_Approve_contract);
    } else if (
      activeChain?.name?.includes("BSC Testnet") &&
      secondChain?.includes("Sepolia")
    ) {
      setDestinationState("16015286601757825753");
      setChainReceiver(BSC_Testnet_to_Eth_Sepolia_DestChainReceiver);
      setCheckSourceChain(BSC_Testnet_to_Eth_Sepolia_SourceChainSender);
      setAllowanceCheckContract(BSC_Testnet_Approve_contract);
    } else if (
      activeChain?.name?.includes("Base Goerli") &&
      secondChain?.includes("Sepolia")
    ) {
      setDestinationState("16015286601757825753");
      setChainReceiver(Base_Goerli_to_Eth_Sepolia_DestChainReceiver);
      setCheckSourceChain(Base_Goerli_to_Eth_Sepolia_SourceChainSender);
      setAllowanceCheckContract(Base_Goerli_Approve_contract);
    } else if (
      activeChain?.name?.includes("Avalanche Fuji") &&
      secondChain?.includes("Sepolia")
    ) {
      setDestinationState("16015286601757825753");
      setChainReceiver(Avalanche_Fuji_to_Eth_Sepolia_DestChainReceiver);
      setCheckSourceChain(Avalanche_Fuji_to_Eth_Sepolia_SourceChainSender);
      setAllowanceCheckContract(Avalanche_Fuji_Approve_contract);
    } else {
      setErrorMessage("wrong network");
    }
  }, [activeChain, secondChain]);

  const { contract } = useContract(checkSourceChain);
  const { mutateAsync: fund } = useContractWrite(contract, "fund");
  const { mutateAsync: sendMessage, error } = useContractWrite(
    contract,
    "sendMessage"
  );

  const fundContract = async () => {
    try {
      setLoading(true);
      const data = await fund({ args: [amount] });
      console.info("contract call success", data);
      toast.success("Transaction successful");
    } catch (err) {
      console.error("contract call failure", error);
      toast.error(`Transaction failed: ${error || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const feeToken = 1;
  const to = address;

  const callSendMessage = async () => {
    try {
      setLoading(true);
      const data = await sendMessage({
        args: [destinationState, chainReceiver, feeToken, to, amount],
      });
      console.info("contract call success", data);
      toast.success("Transaction successful");
    } catch (err) {
      console.error("contract call failure", err);
      toast.error(`Transaction failed: ${err || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const { contract: allowanceCheck } = useContract(allowanceCheckContract);
  const { data: allowanceData } = useContractRead(allowanceCheck, "allowance", [
    _owner,
    checkSourceChain,
  ]);

  const { contract: getFunderBalanceData } = useContract(checkSourceChain);
  const { data: getFunderBalance } = useContractRead(
    getFunderBalanceData,
    "getFunderBalance",
    [funder]
  );

  useEffect(() => {
    const ethers = require("ethers");
    if (allowanceData?._hex) {
      const bigNumber = ethers.BigNumber.from(allowanceData._hex);
      const formatted = ethers.utils.formatUnits(bigNumber, 6);
      setFormattedNumber(formatted);
    } else {
      console.error("allowanceData._hex is undefined");
    }

    if (getFunderBalance?._hex) {
      const bigNumber = ethers.BigNumber.from(getFunderBalance._hex);
      const formattedFunderBalance = ethers.utils.formatUnits(bigNumber, 6);
      setGetFunderBalanceNumber(formattedFunderBalance);
    } else {
      console.error("allowanceData._hex is undefined");
    }
  }, [formattedNumber, _owner, checkSourceChain, getFunderBalanceNumber]);

  return (
    <div>
      <div className={styles.crossInputBody}>
        <div className={styles.swapInputBody}>
          <label htmlFor="success" className={styles.swapLabel}>
            You Pay
          </label>
          <input
            name="quantity"
            defaultValue={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className={styles.swapInput}
          />
        </div>
        <div>{/* <TokensDropdown /> */}</div>
      </div>
      <div className={styles.crossChainBctn}>{}</div>
      <div className={styles.crossChainBtnc}>
        {Number.isNaN(amount) || amount === undefined || "" || null ? (
          <div>
            <div className={styles.errorMessage}>Fill in an amount</div>
          </div>
        ) : (
          <div>
            {getFunderBalanceNumber &&
            getFunderBalanceNumber >= amount &&
            formattedNumber &&
            formattedNumber >= amount ? (
              <div>
                <button
                  className={styles.crossChainBtn}
                  onClick={callSendMessage}
                  disabled={loading}
                >
                  Swap
                </button>
              </div>
            ) : (
              <div>
                {getFunderBalanceNumber && getFunderBalanceNumber >= amount ? (
                  <button
                    className={styles.crossChainBtn}
                    onClick={callSendMessage}
                    disabled={loading}
                  >
                    Swap
                  </button>
                ) : formattedNumber && formattedNumber >= amount ? (
                  <div>
                    <button
                      className={styles.crossChainBtn}
                      onClick={fundContract}
                      disabled={loading}
                    >
                      Fund
                    </button>
                    <div className={styles.Tooltip_body}>
                      <Tooltip
                        className={styles.Tooltip}
                        content="When users use Uniswap, Rhino, Sushiswap, or Aave, the platform will require users to first transfer tokens from their wallets to a contract, and then hand over another token of equal value to the user."
                        arrow={false}
                      >
                        <div className={styles.whyApprove}> Why Fund?</div>
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <ApproveModalPage />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
