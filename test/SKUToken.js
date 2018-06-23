const assertRevert = require('./helpers/assertRevert')

const SKUToken = artifacts.require('./SKUToken.sol')

contract('SKUToken', function ([producer, shipper, delivery, hacker]) {
  let skuToken
  let skuTokenAddress

  const idTokenId = 12345
  const origin = 'CN'
  const destination = 'BE'

  beforeEach('setup contract for each test', async function () {
      skuToken = await SKUToken.new(idTokenId, origin, destination, {from: producer})
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

      await assertRevert(skuToken.claimOwnership({from: hacker}))
  })

  it('does not let anyone but the owner create SKUs', async function () {
    const skuId = 98765
    const barCode = 'abcde'

    await assertRevert(skuToken.recordSKU(skuId, barCode, { from: shipper }))
    await assertRevert(skuToken.recordSKU(skuId, barCode, { from: hacker }))
  })

  it('prevents counterfeiting and improves movement of goods for a better world (HAPPY PATH)', async function () {
      // CREATE SKU
      const skuId = 98765
      const barCode = 'abcde'
      await skuToken.recordSKU(skuId, barCode, { from: producer })

      assert.equal(await skuToken.totalSupply(), 1)

      // HANDOVER TO SHIPPER
      assert.equal(await skuToken.owner(), producer)
      await skuToken.proposeOwnership(shipper)

      assert.equal(await skuToken.owner(), producer)
      assert.equal(await skuToken.candidateOwner(), shipper)

      await skuToken.claimOwnership({from: shipper})

      assert.equal(await skuToken.owner(), shipper)

      // CANNOT PRODUCE ANY MORE SKUS AFTER HANDOVER
      assert.equal(await skuToken.productionAllowed(), false)
      await assertRevert(skuToken.recordSKU(8967897896, 'kljijioji', { from: producer }))
      await assertRevert(skuToken.recordSKU(6156525443, 'sdhjhyzvv', { from: shipper }))

      // VETTING BY THE CUSTOMS - TODO

      // HANDOVER FROM SHIPPER TO END CONSUMER - TODO
  })
})
