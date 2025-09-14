// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying contracts...");

  // 1. Deploy ReputationLedger
  const ReputationLedger = await ethers.getContractFactory("ReputationLedger");
  const reputationLedger = await ReputationLedger.deploy();
  await reputationLedger.waitForDeployment();
  console.log("✅ ReputationLedger deployed at:", reputationLedger.target);

  // 2. Deploy MeetupManager (pass ReputationLedger address)
  const MeetupManager = await ethers.getContractFactory("MeetupManager");
  const meetupManager = await MeetupManager.deploy(reputationLedger.target);
  await meetupManager.waitForDeployment();
  console.log("✅ MeetupManager deployed at:", meetupManager.target);

  // 3. Deploy ExpenseChannel
  const ExpenseChannel = await ethers.getContractFactory("ExpenseChannel");
  const expenseChannel = await ExpenseChannel.deploy();
  await expenseChannel.waitForDeployment();
  console.log("✅ ExpenseChannel deployed at:", expenseChannel.target);

  console.log("\n🎉 All contracts deployed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
