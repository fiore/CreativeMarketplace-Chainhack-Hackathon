var PatreonToken = artifacts.require("./PatreonToken.sol");

module.exports = function(deployer) {
  deployer.deploy(PatreonToken);
};