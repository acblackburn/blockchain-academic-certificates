const VerifyCertificate = artifacts.require("VerifyCertificate");

module.exports = function (deployer) {
  deployer.deploy(VerifyCertificate);
};
