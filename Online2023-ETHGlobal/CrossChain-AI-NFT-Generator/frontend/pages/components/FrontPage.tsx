import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { parseEther } from "ethers";

// ABIs
import NFT from "../abis/NFT.json";

import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";

const FrontPage = () => {
  //State constants
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<any | null>(null);
  const [backendData, setBackendData] = useState<any | null>(null);

  //uploading image constants
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectImage] = useState("");
  const [selectedFile, setSelectFile] = useState<File>();

  const [mostRecentImage, setMostRecentImage] = useState("");

  const CONTRACT_ADDRESS = "0x4478dd7baaD16958B400f0C72c8bADa02b2CEa79";

  //Mint Function
  const {
    data: mintData,
    write: purchase,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: NFT,
    functionName: "mint",
  });

  //fetching data from API
  async function fetchMostRecentImage() {
    try {
      const response = await fetch("/api/getMostRecentImage");
      const data = await response.json();
      setMostRecentImage(data.mostRecentImage);
    } catch (error) {
      console.error("Error fetching most recent image:", error);
    }
  }

  //Handles uploaded image
  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("myImage", selectedFile);
      const { data } = await axios.post("/api/image", formData);
      console.log(data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
    setUploading(false);
    setMessage("Success");
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name === "" || description === "") {
      setMessage("Please provide a name and description");
      return;
    }

    fetchMostRecentImage();

    // Call AI API to generate a image based on description
    const tokenUri = await createImage();

    if (tokenUri !== null) {
      if (tokenUri !== undefined) {
        // Mint NFT
        await mintImage(tokenUri);
      }
    }
  };

  //Generates Image with AI API
  const createImage = async () => {
    setMessage("Generating Image...");
    const url = "http://127.0.0.1:12345";

    const data = {
      userimagepath: `/Users/hosanna/hackathon/online2023-ethglobal/Happy-Planet-v4/frontend/userImage/${mostRecentImage}`,
      description: description,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log(response.body);
        const resultData = await response.json();
        const metaData = response.body;

        console.log(resultData);
        console.log(metaData);

        //Converting to Relative path to AI image so we can render it to the frontend
        const relativePath = resultData.aiimagepath.replace(
          "/Users/hosanna/hackathon/online2023-ethglobal/Happy-Planet-v4/frontend/public",
          ""
        );
        //setting the AI Image to the front end
        setImage(relativePath);

        //Backend Data
        setBackendData(resultData);

        setMessage("Image Generated Successfully");

        //Path of the AI image
        const ipnft = resultData.ipnft; // Image address received after uploading NFT to IPFS
        const tokenUri = resultData.url; // Metadata address received after uploading NFT to IPFS
        console.log(tokenUri, ipnft);

        return tokenUri;
      } else {
        console.error(`Error: ${response.status}`);
        setMessage("Image generation failed 1, Try again");
        return null;
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Image generation failed 2, Try again");
      return null;
    }
  };

  //Mint Image
  const mintImage = async (tokenURI: string) => {
    const transaction = async () => {
      purchase({
        args: [tokenURI],
        value: parseEther("1"),
      });
    };

    await transaction();
  };

  useEffect(() => {
    // This effect will run whenever the `image` state changes
    if (image) {
      // If `image` is not null, it means there's a new image, and you can update the <Image /> component.
      // You might want to add additional logic here if needed.
    }
  }, [image]);

  return (
    <div className="max-w-4xl mx-auto p-20 space-y-6">
      <div className="form">
        <form onSubmit={submitHandler}>
          <label>
            <input
              type="file"
              hidden
              onChange={({ target }) => {
                if (target.files) {
                  const file = target.files[0];
                  setSelectImage(URL.createObjectURL(file));
                  setSelectFile(file);
                }
              }}
            />
            <div
              className="w-40 aspect-video rounded flex items-center justify-center
          border-2 border-dashed cursor-pointer text-white"
            >
              {selectedImage ? (
                <img src={selectedImage} alt=""></img>
              ) : (
                <span>Select Image</span>
              )}
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{ opacity: uploading ? ".5" : "1" }}
            className="bg-red-600 p-3 w-32 text-center rounded-full text-white"
          >
            {uploading ? "Uploading.." : "Upload"}
          </button>

          <input
            type="text"
            placeholder="Create a Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Create a Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="homepage__btn" type="submit">
            Mint
          </button>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </form>
        <div className="card">
          {image ? (
            <Image
              alt="My Image"
              src={image} // Path relative to the 'public' directory
              width={300} // Set the desired width
              height={200} // Set the desired height
            />
          ) : (
            <span></span>
          )}
        </div>
      </div>
      <p> {message}</p>
      {backendData && (
        <div className="text-white">
          <br />
          <br />
          <br />
          <br />
          <h3>Response from Backend:</h3>
          <pre>{JSON.stringify(backendData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FrontPage;
