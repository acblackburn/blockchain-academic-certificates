const VerifyCertificate = artifacts.require("VerifyCertificate");

module.exports = function (deployer) {
  const rootAddress = '0xc1756bEFE69494908e5e536e25B0e816EC45C9D4';
  deployer.deploy(VerifyCertificate, rootAddress);
};
