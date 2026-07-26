<div align="center">

# 🚀 Complete Deployment Guide
**CertiProof dApp Production Deployment Strategy**

</div>

<hr />

## 📋 Overview
This guide covers deploying your fully decentralized certificate validation system to production. 

**Infrastructure Breakdown:**
- ⛓️ **Smart Contract**: Ethereum Sepolia Testnet
- 🖥️ **Backend API**: Node.js/Express (via Render)
- 🎨 **Frontend UI**: React (via Vercel)
- 🌐 **Storage**: IPFS Pinata 

---

## ✅ Deployment Status

- [x] **Smart Contract**: Deployed to Sepolia
- [x] **Verification**: Contract verified on Etherscan
- [x] **IPFS Storage**: Pinata configured and live
- [x] **Local Dev**: Environment running smoothly

---

## 🌩️ Deployment Steps (Cloud)

### Step 1: Deploy Backend (Render.com - Free)

1. Ensure your `backend/package.json` specifies Node engines (`>=18.0.0`).
2. Push your repository to GitHub.
3. On Render, create a **New Web Service**.
4. Set the Root Directory to `backend`.
5. Environment Variables needed:
   - `AES_ENCRYPTION_KEY`
   - `HARDHAT_NETWORK=sepolia`
   - `USE_IPFS=true`
   - `PINATA_API_KEY` & `PINATA_JWT`
6. Deploy! Copy the `.onrender.com` URL.

### Step 2: Deploy Frontend (Vercel - Free)

1. In your frontend directory, create `.env.production` containing:
   - `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`
   - `REACT_APP_NETWORK_NAME=Sepolia`
2. Connect your repository to Vercel.
3. Set the Root Directory to `frontend`.
4. Deploy and verify!

---

## 🔒 Security Posture

- 🛡️ **Encryption**: All metadata is AES-256 encrypted before IPFS pinning.
- 🔑 **Keys**: Never commit `.env` or Private Keys.
- 🚦 **CORS**: Strict Origin controls in `backend/server.js`.

---

## 💰 Expected Costs

| Service | Plan | Monthly Cost |
| :--- | :--- | :--- |
| **Vercel** (Frontend) | Hobby | $0.00 |
| **Render** (Backend) | Free Instance | $0.00 |
| **Pinata** (IPFS) | Free (1GB) | $0.00 |
| **Sepolia** (Network) | Testnet | 0.00 SepoliaETH |
| **TOTAL** | | **$0.00** 💸 |

<hr />

<div align="center">
  You are fully deployed and ready for production! 🌍🚀
</div>
