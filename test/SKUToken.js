const assertRevert = require('./helpers/assertRevert')

const SKUToken = artifacts.require('./SKUToken.sol')

contract('SKUToken', function ([producer, shipper, consumerAlice, consumerBob, hacker]) {
  let skuToken
  let skuTokenAddress

  const idTokenId = 12345
  const origin = 'CN'
  const destination = 'BE'

  beforeEach('setup contract for each test', async function () {
      skuToken = await SKUToken.new(idTokenId, origin, destination, {from: producer, gas: 5000000})
      skuTokenAddress = await skuToken.address
  })

  it('is initially deployed with the right parameters', async function () {
      assert.equal(await skuToken.getIDTokenId(), idTokenId)
      assert.equal(await skuToken.getOrigin(), origin)
      assert.equal(await skuToken.getDestination(), destination)
      assert.equal(await skuToken.owner(), producer)
      assert.equal(await skuToken.totalSupply(), 0)
      assert.equal(await skuToken.productionAllowed(), true)
  })

  it('does not let a hacker claim ownership during a handover from one party to the other', async function () {
      await skuToken.proposeOwnership(shipper)

      assert.equal(await skuToken.owner(), producer)
      assert.equal(await skuToken.candidateOwner(), shipper)

      await assertRevert(skuToken.takeOwnership({from: hacker}))
  })

  it('does not let anyone but the owner create SKUs', async function () {
    const skuId = 98765
    const barCode = 'abcde'
    const description = 'A pair of shoes'

    await assertRevert(skuToken.recordSKU(skuId, barCode, description, { from: shipper }))
    await assertRevert(skuToken.recordSKU(skuId, barCode, description, { from: hacker }))
  })

  it('prevents counterfeiting and improves movement of goods for a better world (HAPPY PATH)', async function () {
      // CREATE SKU
      const skuIds = [ 98765, 287373, 19813 ]
      const barCodes = [ 'abcde', 'ejdjc', 'icush' ]
      const descriptions = ['A pair of shoes', 'A pair of shoes', 'A pair of shoes']

      await skuToken.recordSKU(skuIds[0], barCodes[0], descriptions[0], { from: producer })
      await skuToken.recordSKU(skuIds[1], barCodes[1], descriptions[1], { from: producer })
      await skuToken.recordSKU(skuIds[2], barCodes[2], descriptions[2], { from: producer })

      assert.equal(await skuToken.totalSupply(), 3)

      assert.equal(await skuToken.tokenBarCode(skuIds[0]), barCodes[0])
      assert.equal(await skuToken.tokenByBarCode(barCodes[0]), skuIds[0])
      assert.equal(await skuToken.tokenDescription(skuIds[0]), descriptions[0])

      assert.equal(await skuToken.ownerOf(skuIds[0]), producer)
      assert.equal(await skuToken.ownerOfByBarCode(barCodes[0]), producer)

      // HANDOVER OF THE SMART CONTRACT FROM PRODUCER TO SHIPPER
      assert.equal(await skuToken.owner(), producer)
      await skuToken.proposeOwnership(shipper)

      assert.equal(await skuToken.owner(), producer)
      assert.equal(await skuToken.candidateOwner(), shipper)

      await skuToken.takeOwnership({from: shipper})

      assert.equal(await skuToken.owner(), shipper)

      // APPROVAL BY THE PRODUCER TO LET SHIPPER TRANSFER SKUS ON THEIR BEHALF
      await skuToken.setApprovalForAll(shipper, true, { from: producer })

      assert.equal(await skuToken.isApprovedForAll(producer, shipper), true)

      // CANNOT PRODUCE ANY MORE SKUS AFTER HANDOVER
      assert.equal(await skuToken.productionAllowed(), false)
      await assertRevert(skuToken.recordSKU(8967897896, 'kljijioji', 'A pair of scissors', { from: producer }))
      await assertRevert(skuToken.recordSKU(6156525443, 'sdhjhyzvv', 'A pair of donkeys', { from: shipper }))

      // VETTING BY THE CUSTOMS - TODO

      // HANDOVER FROM SHIPPER TO END CONSUMER
      await skuToken.safeTransferFrom(producer, consumerAlice, skuIds[0], { from: shipper })
      await skuToken.safeTransferFrom(producer, consumerBob, skuIds[1], { from: shipper })

      assert.equal(await skuToken.ownerOf(skuIds[0]), consumerAlice)
      assert.equal(await skuToken.ownerOf(skuIds[1]), consumerBob)
  })
})
