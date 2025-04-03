# LedgerVest - Blockchain Investment Platform

LedgerVest is a decentralized investment and fundraising platform built on Ethereum that allows investors to contribute to campaigns and campaign managers to raise funds with transparency and security through smart contracts.

![LedgerVest Platform](https://placeholder-image.com/blockchain-platform.png)

## 🚀 Features

- **Decentralized Fundraising**: Create and manage fundraising campaigns on the blockchain
- **MetaMask Integration**: Seamless wallet connection for transactions
- **Smart Contract Security**: All funds are managed through secure smart contracts
- **Transparent Fund Management**: View campaign balances, contributors, and transaction history
- **Democratic Decision Making**: Vote on fund withdrawal requests
- **Multi-contributor Support**: Multiple people can contribute to a single campaign

## 🔧 Technologies

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Blockchain**: Ethereum (Sepolia Testnet), Solidity, Hardhat
- **Authentication**: MetaMask wallet connection
- **State Management**: React Context API
- **Development Tools**: Hardhat, ethers.js

## 📋 Prerequisites

- Node.js (v18+)
- npm or yarn
- MetaMask browser extension
- Sepolia testnet ETH (for testing)

## 🛠️ Setup Instructions

**important**  
For frontend/backend development, there's no need to rebuild the blockchain  
just directly run the belowing and you should see the webpage at localhost:3000  

```bash
npm install
npm run dev
```

## To build the whole project from scratch

### 1. Clone the Repository

```bash
git clone https://gitlab.oit.duke.edu/cw555/fintech512-project_ledgervest.git
cd fintech512-project_ledgervest
# Install dependencies
npm install
```

### 2. Smart Contract Deployment

```bash
# Create .env file
touch .env
```

Add the following to your `.env` file:
(remember to add `.env` to `.gitignore` to prevent pushing private key to repo)

```env
SEPOLIA_RPC=<your_alchemy_sepolia_url>
PRIVATE_KEY=<your_metamask_private_key>  # Include 0x prefix
```

To get your Alchemy Sepolia URL:

1. Create an account at [Alchemy](https://www.alchemy.com/)
2. Create a new app and select Ethereum/Sepolia
3. Copy the HTTP API key

```bash
# Compile the smart contracts
cd blockchain
npx hardhat compile

# Run tests locally (no real ETH used)
npx hardhat test

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

After deployment, you'll see a CampaignFactory address in the console. Note this address.
You should see `Campaign.json`, `CampaignFactory.json`, `contract-address.json` being copied to `web/src/utils/abis/`

### 3. Frontend Setup
below should be all done if correctly deployed the smart contract

```bash
# Navigate to the web folder
cd ../web
```

Create or update `src/utils/abis/contract-address.json` if necessary:

```json
{
  "CampaignFactory": "YOUR_COPIED_FACTORY_ADDRESS"
}
```

Ensure the ABI files are in place (if they weren't copied automatically):

```bash
cp ../blockchain/artifacts/contracts/Campaign.sol/Campaign.json src/utils/abis/
cp ../blockchain/artifacts/contracts/Campaign.sol/CampaignFactory.json src/utils/abis/
```

### 4. Start the Application

```bash
# Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🧩 Project Structure

```bash
blockchain/                # Smart contract code
├── contracts/            # Solidity contracts
│   └── Campaign.sol      # Main contract
├── scripts/              # Deployment scripts
├── test/                 # Contract tests
└── hardhat.config.js     # Hardhat configuration

web/                      # Frontend application
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js pages
│   │   ├── page.tsx      # Homepage
│   │   ├── projects/     # Projects listing
│   │   ├── campaigns/    # Campaign details
│   │   └── create/       # Create campaign
│   ├── components/       # React components
│   ├── lib/              # Library code
│   │   └── context/      # React contexts
│   └── utils/            # Utility functions
│       ├── abis/         # Contract ABIs
│       └── ethers.js     # Ethereum utilities
└── next.config.js        # Next.js configuration
```

## 📝 Usage Guide

### Connecting Your Wallet

1. **Set MetaMask to Sepolia**: Make sure your MetaMask is connected to the Sepolia testnet
2. **Get Sepolia ETH**: Request test ETH from a [Sepolia faucet](https://sepoliafaucet.com/)
3. **Connect Wallet**: Click the "Connect Wallet" button in the top-right corner

### Creating a Campaign

1. Click "Create Campaign" button
2. Set the minimum contribution amount (in ETH)
3. Submit and confirm the transaction in MetaMask
4. Your campaign will appear in the campaigns list once mined

### Contributing to a Campaign

1. Browse available campaigns
2. Click on a campaign to view details
3. Enter contribution amount (must be ≥ minimum contribution)
4. Click "Contribute" and confirm in MetaMask

### Creating a Spending Request (Campaign Managers)

1. Navigate to your campaign
2. Create a new spending request with:
   - Description of the purpose
   - Amount in ETH
   - Recipient address
3. Confirm transaction in MetaMask

### Approving Requests (Contributors)

1. Navigate to a campaign you've contributed to
2. View the "Spending Requests" section
3. Click "Approve" on requests you support
4. Confirm transaction in MetaMask

### Finalizing Requests (Campaign Managers)

1. After receiving sufficient approvals (>50% of contributors)
2. Click "Finalize" on the request
3. Confirm transaction in MetaMask
4. Funds will be transferred to the recipient

## 🔗 Blockchain Integration Details

### Smart Contracts

The platform uses two main contracts:

1. **CampaignFactory**: Creates new campaigns and tracks all deployed campaigns
2. **Campaign**: Handles individual campaign logic including:
   - Contributions
   - Spending requests
   - Approvals
   - Fund transfers

### Wallet Connection

The platform connects to MetaMask or other Ethereum wallets via the Web3 provider API. Key operations:

- **Read Operations**: View campaign details, balances, and request status
- **Write Operations**: Create campaigns, contribute funds, approve requests, finalize transfers

### Transaction Flow

1. User initiates action (create, contribute, approve, etc.)
2. Wallet prompts for transaction confirmation
3. Transaction is sent to the Ethereum network
4. UI updates when transaction is mined

## 🧪 Development Notes

### Sepolia Testnet

All development and testing should be done on the Sepolia testnet to avoid using real ETH.

### Local Development

For local development without blockchain interaction:
- Comment out blockchain calls in `useWallet` hook
- Use mock data for testing UI

### Troubleshooting

- **Transaction Errors**: Ensure you have sufficient Sepolia ETH for gas
- **Contract Interactions**: Check that ABI files match deployed contracts
- **MetaMask Connection**: Reset MetaMask account if experiencing connection issues


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact
