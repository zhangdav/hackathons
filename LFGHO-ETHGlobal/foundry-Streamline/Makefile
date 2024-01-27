-include .env

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
endif

ifeq ($(findstring --network mumbai,$(ARGS)),--network mumbai)
	NETWORK_ARGS := --rpc-url $(MUMBAI_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(POLYGONSCAN_API_KEY) -vvvv
endif

deploy-streamline:
	@forge script script/DeployStreamLine.s.sol:DeployStreamLine $(NETWORK_ARGS) 

deploy-destchainreceiver:
	@forge script script/DeployDestChainReceiver.s.sol:DeployDestChainReceiver $(NETWORK_ARGS) 
