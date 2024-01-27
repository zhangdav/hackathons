const { expect, assert } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

describe("NFT", () => {
    let deployer, minter
    let nft, hpToken

    const NAME = "Happy Planet"
    const SYMBOL = "HP"
    const COST_ETH = tokens(1) // 1 ETH
    const COST_TOKEN = tokens(1)
    const tokenURI =
        "https://ipfs.io/ipfs/bafyreid4an6ng6e6hok56l565eivozra3373bo6funw3p5mhq5oonew6u4/metadata.json"

    beforeEach(async () => {
        // Setup accounts
        ;[deployer, minter] = await ethers.getSigners()

        // Deploy Real Estate
        const HPToken = await ethers.getContractFactory("HPToken")
        hpToken = await HPToken.deploy()
        const NFT = await ethers.getContractFactory("NFT")
        nft = await NFT.deploy(NAME, SYMBOL, COST_ETH, COST_TOKEN, hpToken.address)

        // Mint
        const transaction = await nft.connect(minter).mint(tokenURI, { value: COST_ETH })
        await transaction.wait()
    })

    describe("Deployment", () => {
        it("Returns owner", async () => {
            const result = await nft.owner()
            expect(result).to.be.equal(deployer.address)
        })

        it("Returns cost", async () => {
            const result = await nft.getCostETH()
            expect(result).to.be.equal(COST_ETH)
        })
    })

    describe("Minting", () => {
        it("Returns owner", async () => {
            const result = await nft.ownerOf("1")
            expect(result).to.be.equal(minter.address)
        })

        it("Returns URI", async () => {
            const result = await nft.tokenURI("1")
            expect(result).to.be.equal(tokenURI)
        })

        it("Updates total supply", async () => {
            const result = await nft.totalSupply()
            expect(result).to.be.equal("1")
        })
    })

    describe("Withdrawing", () => {
        let balanceBefore

        beforeEach(async () => {
            balanceBefore = parseFloat(
                ethers.utils.formatUnits(await ethers.provider.getBalance(deployer.address), 18),
            )

            const transaction = await nft.connect(deployer).onlyOwnerWithdraw()
            await transaction.wait()
        })

        it("Updates the owner balance", async () => {
            const result = parseFloat(
                ethers.utils.formatUnits(await ethers.provider.getBalance(deployer.address), 18),
            )
            expect(result).to.be.greaterThan(parseFloat(balanceBefore))
        })

        it("Updates the contract balance", async () => {
            const result = await ethers.provider.getBalance(nft.address)
            expect(result).to.equal(0)
        })
    })
})
