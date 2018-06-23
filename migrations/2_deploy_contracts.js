var IDToken = artifacts.require("./tokens/IDToken/IDToken.sol");
var SKUToken = artifacts.require("./tokens/SKUToken/SKUToken.sol");

module.exports = function(deployer) {
  // Deploy the IDToken contract
  deployer.deploy(IDToken).then(async function(instance) {
    idToken = instance;
    // Register a few trademarks
    await idToken.recordID(12345, "Nike")
    await idToken.recordID(67890, "Apple")
  }).then(function(result) {
    // If this callback is called, the transaction was successfully processed.
    // console.log(await idToken.totalSupply())
  }).catch(function(e) {
    // There was an error! Handle it.
  })

  // Deploy the SKUToken contract
  deployer.deploy(SKUToken, 12345, 'CN', 'BE').then(async function(instance) {
    skuToken = instance;

    const skuIds = [ 98765, 287373, 19813 ]
    const barCodes = [ 'abcde', 'ejdjc', 'icush' ]
    const descriptions = ['A pair of shoes', 'A pair of shoes', 'A pair of shoes']

    await skuToken.recordSKU(skuIds[0], barCodes[0], descriptions[0])
    await skuToken.recordSKU(skuIds[1], barCodes[1], descriptions[1])
    await skuToken.recordSKU(skuIds[2], barCodes[2], descriptions[2])
  }).then(function(result) {
    // If this callback is called, the transaction was successfully processed.
  }).catch(function(e) {
    // There was an error! Handle it.
  })
};
