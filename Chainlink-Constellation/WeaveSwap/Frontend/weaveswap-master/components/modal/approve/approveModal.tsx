// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { useChain } from "@thirdweb-dev/react";
import styles from "./approve.module.css";
import { MediaRenderer } from "@thirdweb-dev/react";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import {
  //mumbai to sepolia
  Polygon_Mumbai_SourceChainSender,
  Mumbai_Approve_contract,
  //sepolia to mumbai
  Sepolia_to_mumbai_SourceChainSender,
  Sepolia_Approve_contract,
  // Optimism_to_Eth_Sepolia -> Eth_Sepolia
  Optimism_to_Eth_Sepolia_SourceChainSender,
  Optimism_Approve_contract,
  // BSC_Testnet _to_Eth_Sepolia -> Eth_Sepolia
  BSC_Testnet_to_Eth_Sepolia_SourceChainSender,
  BSC_Testnet_Approve_contract,
  // Base_Goerli _to_Eth_Sepolia -> Eth_Sepolia
  Base_Goerli_to_Eth_Sepolia_SourceChainSender,
  Base_Goerli_Approve_contract,
  // Avalanche_Fuji _to_Eth_Sepolia -> Eth_Sepolia
  Avalanche_Fuji_to_Eth_Sepolia_SourceChainSender,
  Avalanche_Fuji_Approve_contract,
} from "@/constants/address";
import { Tooltip, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { selectActiveChain } from "@/redux/features/activeChain";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { Spinner } from "flowbite-react";
// Main component
export default function ApproveModalPage() {
  // Retrieve the active chain
  const chain = useChain();

  // State variables
  const [openModal, setOpenModal] = useState(false);
  const [_value, setValue] = useState<string>("0.0008");
  const [spender, setSpender] = useState("");
  const [approve_contract, setApprove_contract] = useState("");
  const [loading, setLoading] = useState(false);

  // Selectors for active and second chains
  const activeChain = useSelector(selectActiveChain);
  const secondChain = localStorage.getItem("secondChain");

  // Effect to determine spender and approval contract based on active and second chains
  useEffect(() => {
    console.log("Checking receiver on chains:", activeChain?.name, secondChain);

    if (
      (activeChain?.name?.includes("mumbai") &&
        secondChain?.includes("sepolia")) ||
      (activeChain?.name?.includes("sepolia") &&
        secondChain?.includes("mumbai"))
    ) {
      setSpender(
        activeChain?.name?.includes("mumbai")
          ? Polygon_Mumbai_SourceChainSender
          : Sepolia_to_mumbai_SourceChainSender
      );
      setApprove_contract(
        activeChain?.name?.includes("mumbai")
          ? Mumbai_Approve_contract
          : Sepolia_Approve_contract
      );
    } else if (
      activeChain?.name?.includes("Optimism Goerli Testnet") &&
      secondChain?.includes("Sepolia")
    ) {
      setSpender(Optimism_to_Eth_Sepolia_SourceChainSender);
      setApprove_contract(Optimism_Approve_contract);
    } else if (
      activeChain?.name?.includes("BSC Testnet") &&
      secondChain?.includes("Sepolia")
    ) {
      setSpender(BSC_Testnet_to_Eth_Sepolia_SourceChainSender);
      setApprove_contract(BSC_Testnet_Approve_contract);
    } else if (
      activeChain?.name?.includes("Base Goerli") &&
      secondChain?.includes("Sepolia")
    ) {
      setSpender(Base_Goerli_to_Eth_Sepolia_SourceChainSender);
      setApprove_contract(Base_Goerli_Approve_contract);
    } else if (
      activeChain?.name?.includes("Avalanche Fuji") &&
      secondChain?.includes("Sepolia")
    ) {
      setSpender(Avalanche_Fuji_to_Eth_Sepolia_SourceChainSender);
      setApprove_contract(Avalanche_Fuji_Approve_contract);
    } else {
      console.log("wrong network");
    }
  }, [activeChain, secondChain]);

  // Contract hooks
  const { contract } = useContract(approve_contract);
  const { mutateAsync: approve } = useContractWrite(contract, "approve");

  // Function to handle contract call
  const call = async () => {
    try {
      setLoading(true);
      const valueInWei = ethers.utils.parseUnits(_value, "ether");
      const data = await approve({ args: [spender, valueInWei] });
      console.info("contract call success", data);
      toast.success("Transaction successful!");
      setOpenModal(false);
    } catch (err) {
      console.error("contract call failure", err);
      toast.error(`Transaction failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Render component
  return (
    <div>
      {/* Button to open the modal */}
      <button onClick={() => setOpenModal(true)} className={styles.activeChain}>
        <MediaRenderer src={chain?.icon?.url} />
        <h4>Approve</h4>{" "}
      </button>
      {/* Tooltip for additional information */}
      <div className={styles.Tooltip_body}>
        <Tooltip
          className={styles.Tooltip}
          content="As per the ERC-20 protocol, a standard developed by the official Ethereum team, users engaging in swap or cross-chain bridge services (e.g., Uniswap, Rhino, Sushiswap) will encounter an approval window when trading ERC-20 tokens. This authorization step ensures adherence to protocol standards and facilitates secure and standardized token transactions. "
          arrow={false}
        >
          <div className={styles.whyApprove}> Why Approve?</div>
        </Tooltip>
      </div>
      {/* Modal for approving transaction */}
      <Modal
        className={styles.Modal}
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className={styles.ModalHeader}>
          <h2> Approve</h2>
          <p>
            Select a chain from our default list or search for a token by symbol
            or address.
          </p>
        </Modal.Header>
        <Modal.Body className={styles.ModalBody}>
          <div className={styles.crossInputBody}>
            {/* Input for the amount to be approved */}
            <div className={styles.swapInputBody}>
              <label htmlFor="success" className={styles.swapLabel}>
                You Pay
              </label>
              <input
                type="text"
                name="quantity"
                defaultValue={_value}
                onChange={(e) => setValue(e.target.value)}
                className={styles.swapInput}
              />
            </div>
            {/* Button to trigger contract call */}
            <div>
              <button
                className={styles.approveBtn}
                onClick={call}
                disabled={loading}
              >
                {loading ? <Spinner /> : " Approve Token"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Toast container for displaying notifications */}
    </div>
  );
}
