var IDToken = artifacts.require("./tokens/IDToken/IDToken.sol");
var SKUToken = artifacts.require("./tokens/SKUToken/SKUToken.sol");

module.exports = function(deployer) {
  deployer.deploy(IDToken);
  deployer.deploy(SKUToken, 12345, 'CN', 'BE');
};
