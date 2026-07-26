const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
    let certificateRegistry;
    let owner;
    let issuer1;
    let issuer2;
    let unauthorized;

    const sampleDocHash = ethers.keccak256(ethers.toUtf8Bytes("Sample Certificate Content"));
    const sampleIPFSCID = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

    beforeEach(async function () {
        [owner, issuer1, issuer2, unauthorized] = await ethers.getSigners();

        const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
        certificateRegistry = await CertificateRegistry.deploy();
        await certificateRegistry.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the deployer as admin", async function () {
            const adminRole = await certificateRegistry.DEFAULT_ADMIN_ROLE();
            expect(await certificateRegistry.hasRole(adminRole, owner.address)).to.be.true;
        });

        it("Should authorize deployer as issuer", async function () {
            expect(await certificateRegistry.isAuthorizedIssuer(owner.address)).to.be.true;
        });
    });

    describe("Issuer Management", function () {
        it("Should allow owner to add authorized issuer", async function () {
            const anyValue = require("@nomicfoundation/hardhat-chai-matchers/withArgs").anyValue;
            await expect(certificateRegistry.addAuthorizedIssuer(issuer1.address))
                .to.emit(certificateRegistry, "IssuerAdded")
                .withArgs(issuer1.address, anyValue);

            expect(await certificateRegistry.isAuthorizedIssuer(issuer1.address)).to.be.true;
        });

        it("Should prevent non-admin from adding issuer", async function () {
            const adminRole = await certificateRegistry.DEFAULT_ADMIN_ROLE();
            await expect(
                certificateRegistry.connect(unauthorized).addAuthorizedIssuer(issuer1.address)
            ).to.be.revertedWithCustomError(certificateRegistry, "AccessControlUnauthorizedAccount")
             .withArgs(unauthorized.address, adminRole);
        });

        it("Should prevent adding zero address as issuer", async function () {
            await expect(
                certificateRegistry.addAuthorizedIssuer(ethers.ZeroAddress)
            ).to.be.revertedWith("Invalid issuer address");
        });

        it("Should emit nothing or just not revert on duplicate, or we can check they are authorized", async function () {
            await certificateRegistry.addAuthorizedIssuer(issuer1.address);
            // AccessControl grantRole does not revert if role already exists, it just returns false internally.
            // We can just verify it doesn't revert.
            await expect(certificateRegistry.addAuthorizedIssuer(issuer1.address)).to.not.be.reverted;
        });

        it("Should allow owner to remove authorized issuer", async function () {
            const anyValue = require("@nomicfoundation/hardhat-chai-matchers/withArgs").anyValue;
            await certificateRegistry.addAuthorizedIssuer(issuer1.address);

            await expect(certificateRegistry.removeAuthorizedIssuer(issuer1.address))
                .to.emit(certificateRegistry, "IssuerRemoved")
                .withArgs(issuer1.address, anyValue);

            expect(await certificateRegistry.isAuthorizedIssuer(issuer1.address)).to.be.false;
        });

        it("Should ignore removing non-authorized issuer without reverting", async function () {
            await expect(
                certificateRegistry.removeAuthorizedIssuer(issuer1.address)
            ).to.not.be.reverted;
        });
    });

    describe("Certificate Issuance", function () {
        beforeEach(async function () {
            await certificateRegistry.addAuthorizedIssuer(issuer1.address);
        });

        it("Should allow authorized issuer to issue certificate", async function () {
            const anyValue = require("@nomicfoundation/hardhat-chai-matchers/withArgs").anyValue;
            await expect(
                certificateRegistry.connect(issuer1).issueCertificate(sampleDocHash, sampleIPFSCID)
            )
                .to.emit(certificateRegistry, "CertificateIssued")
                .withArgs(
                    sampleDocHash,
                    sampleIPFSCID,
                    issuer1.address,
                    anyValue
                );

            const cert = await certificateRegistry.getCertificate(sampleDocHash);
            expect(cert.exists).to.be.true;
            expect(cert.docHash).to.equal(sampleDocHash);
            expect(cert.ipfsCID).to.equal(sampleIPFSCID);
            expect(cert.issuer).to.equal(issuer1.address);
        });

        it("Should prevent unauthorized address from issuing certificate", async function () {
            const issuerRole = await certificateRegistry.ISSUER_ROLE();
            await expect(
                certificateRegistry.connect(unauthorized).issueCertificate(sampleDocHash, sampleIPFSCID)
            ).to.be.revertedWithCustomError(certificateRegistry, "AccessControlUnauthorizedAccount")
             .withArgs(unauthorized.address, issuerRole);
        });

        it("Should prevent issuing certificate with zero hash", async function () {
            await expect(
                certificateRegistry.connect(issuer1).issueCertificate(ethers.ZeroHash, sampleIPFSCID)
            ).to.be.revertedWith("Invalid document hash");
        });

        it("Should prevent issuing certificate with empty IPFS CID", async function () {
            await expect(
                certificateRegistry.connect(issuer1).issueCertificate(sampleDocHash, "")
            ).to.be.revertedWith("Invalid IPFS CID");
        });

        it("Should prevent issuing duplicate certificate", async function () {
            await certificateRegistry.connect(issuer1).issueCertificate(sampleDocHash, sampleIPFSCID);

            await expect(
                certificateRegistry.connect(issuer1).issueCertificate(sampleDocHash, sampleIPFSCID)
            ).to.be.revertedWith("Certificate already exists");
        });
    });

    describe("Certificate Verification", function () {
        beforeEach(async function () {
            await certificateRegistry.addAuthorizedIssuer(issuer1.address);
            await certificateRegistry.connect(issuer1).issueCertificate(sampleDocHash, sampleIPFSCID);
        });

        it("Should verify existing certificate", async function () {
            const result = await certificateRegistry.verifyCertificate(sampleDocHash);

            expect(result.exists).to.be.true;
            expect(result.ipfsCID).to.equal(sampleIPFSCID);
            expect(result.issuer).to.equal(issuer1.address);
            expect(result.timestamp).to.be.gt(0);
        });

        it("Should return false for non-existent certificate", async function () {
            const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("Fake Certificate"));
            const result = await certificateRegistry.verifyCertificate(fakeHash);

            expect(result.exists).to.be.false;
            expect(result.ipfsCID).to.equal("");
            expect(result.issuer).to.equal(ethers.ZeroAddress);
            expect(result.timestamp).to.equal(0);
        });

        it("Should allow anyone to verify certificate", async function () {
            const result = await certificateRegistry.connect(unauthorized).verifyCertificate(sampleDocHash);
            expect(result.exists).to.be.true;
        });
    });

    describe("Multiple Issuers", function () {
        it("Should allow multiple issuers to issue different certificates", async function () {
            await certificateRegistry.addAuthorizedIssuer(issuer1.address);
            await certificateRegistry.addAuthorizedIssuer(issuer2.address);

            const hash1 = ethers.keccak256(ethers.toUtf8Bytes("Certificate 1"));
            const hash2 = ethers.keccak256(ethers.toUtf8Bytes("Certificate 2"));

            await certificateRegistry.connect(issuer1).issueCertificate(hash1, "CID1");
            await certificateRegistry.connect(issuer2).issueCertificate(hash2, "CID2");

            const cert1 = await certificateRegistry.getCertificate(hash1);
            const cert2 = await certificateRegistry.getCertificate(hash2);

            expect(cert1.issuer).to.equal(issuer1.address);
            expect(cert2.issuer).to.equal(issuer2.address);
        });
    });
});
