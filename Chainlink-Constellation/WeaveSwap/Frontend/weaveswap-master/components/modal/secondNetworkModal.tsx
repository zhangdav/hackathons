import React, { useState, useEffect } from "react";
import { useChain } from "@thirdweb-dev/react";
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
import { setSecondChain } from "@/redux/features/selectedChain";
import { ChainType } from "@/types/chainType";

export default function SecondNetworkModal() {
  const dispatch = useAppDispatch();

  // Check if the code is running on the client side
  const isClient = typeof window !== "undefined";

  // State to keep track of the selected chain
  const [selectedChainState, setSelectedChainState] = useState<string | "">(
    isClient
      ? (JSON.parse(localStorage.getItem("secondChain")!) as string) || ""
      : ""
  );

  // State to keep track of the selected chain image URL
  const [selectedChainImage, setSelectedChainImage] = useState<string>(
    isClient ? localStorage?.getItem("selectedChainImage") || "" : ""
  );

  // Handler for the selection change in the dropdown
  const handleSelectChange = (value: string, imageUrl: string) => {
    // Update the selectedChain state with the chosen value
    setSelectedChainState(value);
    // Update the selectedChainImage state with the corresponding image URL
    setSelectedChainImage(imageUrl);
  };

  // State to control the modal's visibility
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Set the active chain in the Redux store when the chain changes
    if (selectedChainState && isClient) {
      dispatch(setSecondChain(selectedChainState));

      // Store the selected chain in local storage
      localStorage.setItem("secondChain", JSON.stringify(selectedChainState));
    }
  }, [selectedChainState, dispatch, selectedChainImage, isClient]);

  console.log("selectedChainState", selectedChainState);
  console.log("selectedChainImage", selectedChainImage);

  return (
    <div>
      <div>
        {/* Button to open the modal */}
        <button
          onClick={() => setOpenModal(true)}
          className={styles.activeChain}
        >
          {/* Display the selected chain image */}
          {selectedChainImage && <MediaRenderer src={selectedChainImage} />}
          {/* Display the selected chain name */}
          <h4>
            {selectedChainState ? String(selectedChainState) : ` Wallet`}
          </h4>{" "}
          {/* Dropdown icon */}
          <Image
            className={styles.dropDownIcon}
            src={dropDownIcon}
            width={20}
            height={20}
            alt="Dropdown Image"
          />
        </button>

        {/* Modal component */}
        <Modal
          className={styles.Modal}
          show={openModal}
          onClose={() => setOpenModal(false)}
        >
          {/* Modal header */}
          <Modal.Header className={styles.ModalHeader}>
            <h2>Select a Chain</h2>
            <p>
              Select a chain from our default list or search for a token by
              symbol or address.
            </p>
          </Modal.Header>

          {/* Modal body */}
          <Modal.Body className={styles.ModalBody}>
            <div className="space-y-6">
              {/* Button to display the selected chain in the modal */}
              <button className={styles.activeChain}>
                {/* Display the selected chain image in the modal */}
                {selectedChainImage && (
                  <MediaRenderer src={selectedChainImage} />
                )}
                {/* Display the selected chain name in the modal */}
                <h4>
                  {" "}
                  {selectedChainState
                    ? String(selectedChainState)
                    : `Connect Wallet`}
                </h4>{" "}
              </button>

              {/* List of chain buttons to switch between chains */}
              <div className={styles.SwitchChains}>
                {/* Button for Sepolia chain */}
                <button
                  onClick={() =>
                    handleSelectChange(Sepolia.name, Sepolia.icon.url)
                  }
                >
                  <MediaRenderer src={Sepolia.icon.url} />
                  Sepolia
                </button>
                {/* 
                {/* Button for Mumbai chain */}
                {/* <button
                  onClick={() =>
                    handleSelectChange(Mumbai.name, Mumbai.icon.url)
                  }
                >
                  <MediaRenderer src={Mumbai.icon.url} />
                  Mumbai
                </button> */}

                {/* Button for AvalancheFuji chain */}
                {/* <button
                  onClick={() =>
                    handleSelectChange(
                      AvalancheFuji.name,
                      AvalancheFuji.icon.url
                    )
                  }
                >
                  <MediaRenderer src={AvalancheFuji.icon.url} />
                  AvalancheFuji
                </button> */}

                {/* Button for BaseGoerli chain */}
                {/* <button
                  onClick={() =>
                    handleSelectChange(BaseGoerli.name, BaseGoerli.icon.url)
                  }
                >
                  <MediaRenderer src={BaseGoerli.icon.url} />
                  BaseGoerli
                </button> */}

                {/* Button for OptimismGoerli chain */}
                {/* <button
                  onClick={() =>
                    handleSelectChange(
                      OptimismGoerli.name,
                      OptimismGoerli.icon.url
                    )
                  }
                >
                  <MediaRenderer src={OptimismGoerli.icon.url} />
                  OptimismGoerli
                </button> */}

                {/* Button for BinanceTestnet chain */}
                {/* <button
                  onClick={() =>
                    handleSelectChange(
                      BinanceTestnet.name,
                      BinanceTestnet.icon.url
                    )
                  }
                >
                  <MediaRenderer src={BinanceTestnet.icon.url} />
                  BinanceTestnet
                </button>  */}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
