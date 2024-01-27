import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navigation = () => {
  return (
    <header>
      <div className="absolute top-10 right-20">
        <ConnectButton
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
          chainStatus="icon"
          label="Connect"
        />
      </div>

      <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 absolute top-10 left-20">
        Happy Planet
      </h1>
    </header>
  );
};

export default Navigation;
