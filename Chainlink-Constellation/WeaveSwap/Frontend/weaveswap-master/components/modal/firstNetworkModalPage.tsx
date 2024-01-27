import React, { useState, useEffect } from "react";
import {
  Sepolia,
  OptimismGoerli,
  BinanceTestnet,
  BaseGoerli,
  AvalancheFuji,
  Mumbai,
} from "@thirdweb-dev/chains";
import { Modal } from "flowbite-react";
import styles from "./modal.module.css";
import Image from "next/image";
import { MediaRenderer } from "@thirdweb-dev/react";
import dropDownIcon from "../../assets/png/dropdownIcon.png";
import { useAppDispatch } from "@/redux/hooks";
import { setActiveChain } from "@/redux/features/activeChain";
import {
  useSwitchChain,
  useChain,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { ChainType } from "@/types/chainType";

// Array to store chain options
const ChainOptions = [
  { id: Mumbai.chainId, name: "Mumbai", icon: Mumbai.icon },
  { id: Sepolia.chainId, name: "Sepolia", icon: Sepolia.icon },

  {
    id: AvalancheFuji.chainId,
    name: "AvalancheFuji",
    icon: AvalancheFuji.icon,
  },
  { id: BaseGoerli.chainId, name: "BaseGoerli", icon: BaseGoerli.icon },
  {
    id: OptimismGoerli.chainId,
    name: "OptimismGoerli",
    icon: OptimismGoerli.icon,
  },
  {
    id: BinanceTestnet.chainId,
    name: "BinanceTestnet",
    icon: BinanceTestnet.icon,
  },
];

const FirstNetworkModal: React.FC = () => {
  const switchChain = useSwitchChain();
  const chain: ChainType | undefined = useChain();
  const [openModal, setOpenModal] = useState(false);
  const status = useConnectionStatus();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set the active chain in the Redux store when the chain changes
    if (chain) {
      dispatch(setActiveChain(chain));
    }
  }, [chain, dispatch]);

  console.log("log", chain);

  // Function to render the connection status based on the network status
  const renderConnectionStatus = () => {
    switch (status) {
      case "unknown":
        return <div>Loading...</div>;
      case "disconnected":
        return <div>Disconnected</div>;
      case "connecting":
        return <div>Connecting...</div>;
      default:
        return chain ? <h4>{chain?.name}</h4> : <h4>Unsupported network</h4>;
    }
  };

  console.log(chain);
  console.log(Sepolia.chainId);

  return (
    <div>
      {/* Button to open the modal */}
      <button onClick={() => setOpenModal(true)} className={styles.activeChain}>
        <MediaRenderer src={chain?.icon?.url} />
        {renderConnectionStatus()}

        <Image
          className={styles.dropDownIcon}
          src={dropDownIcon}
          width={20}
          height={20}
          alt="Dropdown Image"
        />
      </button>
      {/* Modal for selecting a chain */}
      <Modal
        className={styles.Modal}
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className={styles.ModalHeader}>
          <h2>Select a Chain</h2>
          <p>
            Select a chain from our default list or search for a token by symbol
            or address.
          </p>
        </Modal.Header>
        <Modal.Body className={styles.ModalBody}>
          <div className="space-y-6">
            {/* Display the active chain in the modal */}
            <button className={styles.activeChain}>
              <MediaRenderer src={chain?.icon?.url} />
              {renderConnectionStatus()}
            </button>
            {/* Display available chain options */}
            <div className={styles.SwitchChains}>
              {ChainOptions.map((option) => (
                <button key={option.id} onClick={() => switchChain(option.id)}>
                  <MediaRenderer src={option.icon.url} />
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FirstNetworkModal;
