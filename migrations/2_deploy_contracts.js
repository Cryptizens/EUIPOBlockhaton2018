var IDToken = artifacts.require("./tokens/IDToken/IDToken.sol");

module.exports = function(deployer) {
  deployer.deploy(IDToken);
};
