import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers } from "hardhat";
import { MyContract } from "web3-config";

use(chaiAsPromised);

describe("Drop V1 Unit Tests", function () {
  let contract: MyContract;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let addrs: SignerWithAddress[];

  before(async () => {
    // Get the signers required for the tests
    [owner, user, ...addrs] = await ethers.getSigners();
  });

  beforeEach(async () => {
    // Deploy the contract
    const Contract = await ethers.getContractFactory("MyContract");
    contract = (await Contract.deploy("Hello World")) as MyContract;
    await contract.deployed();
  });

  describe("METHOD : SetMessage", async () => {
    it("should set a new message", async () => {
      expect(await contract.message()).to.be.eq("Hello World");

      await contract.setMessage("Hello");

      expect(await contract.message()).to.be.eq("Hello");
    });
  });
});
