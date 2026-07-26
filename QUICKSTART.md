<div align="center">

# 🚀 CertiProof Quick Start Guide

**Get your decentralized validation system up and running in minutes.**

</div>

<hr />

## ⚡ Quick Setup (Windows)

We provide a streamlined experience for Windows users.

### Option 1: Automated Setup (Recommended)

Run the automated setup script to install all dependencies across the monorepo:
```cmd
setup.bat
```

### Option 2: Manual Setup

If you prefer manual control:
```bash
# Install all dependencies from the root directory
npm run install:all
```

<hr />

## 📝 Configuration

1. **Copy the environment file**:
```bash
copy .env.example .env
```

2. **Configure your `.env`**:
   - `AES_ENCRYPTION_KEY`: Generate a secure 32-character key for metadata encryption.
   - You can leave all other settings as their defaults for local testing.

<hr />

## 🏃 Running the Application

To start the full stack, you need to spin up the local blockchain, deploy the contract, and start the backend/frontend.

### Step 1: Start Hardhat Local Blockchain
Open PowerShell/CMD and start the local node:
```bash
cd contracts
npx hardhat node
```
⚠️ **Keep this terminal open!** It provides your test accounts and private keys with fake ETH.

### Step 2: Deploy the Smart Contract
Open a *new* terminal and run the deployment script:
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```
*The contract address is automatically saved to your backend/frontend `.env` files.*

### Step 3: Start the Backend API
Open a *new* terminal:
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000`*

### Step 4: Start the Frontend Dashboard
Open a *new* terminal:
```bash
cd frontend
npm start
```
*Frontend opens automatically at `http://localhost:3000`*

<hr />

## 🦊 Configuring MetaMask

To interact with CertiProof locally, connect your MetaMask wallet:

1. **Add Local Network**:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency**: `ETH`

2. **Import a Test Account**:
   - Copy one of the **Private Keys** from your Hardhat terminal (Step 1).
   - In MetaMask: `Accounts` → `Import Account` → Paste the private key.
   - *Boom! You now have test ETH to issue certificates.*

<hr />

## 🎯 System Walkthrough

### 1. Issue a Certificate 🎓
1. Visit `http://localhost:3000` and click **Connect Wallet**.
2. Navigate to **Issue Certificate**.
3. Upload any test file (PDF, Image).
4. Fill out the student metadata.
5. Click **Issue** and confirm the MetaMask transaction.
6. *Copy the document hash for testing!*

### 2. Verify Authenticity 🔍
1. Navigate to **Verify Certificate**.
2. Upload the **exact same file** you issued.
3. See the instant **VALID** result and metadata decrypted from IPFS!

### 3. Test Tamper Detection 🚨
1. Modify the certificate file slightly (change a pixel or text character).
2. Upload the modified file to the Verification page.
3. Watch the system immediately detect the tampering (**INVALID**).

<hr />

## 🐳 Docker Alternative

If you prefer containerization:
```bash
docker-compose up --build
```
This spins up the entire stack seamlessly.

<hr />

## 🧪 Testing Suite

Run the full smart contract test suite to verify integrity:
```bash
cd contracts
npx hardhat test
```

<div align="center">
  <b>Happy Building!</b> Let's secure the future of credentials.
</div>
