const IDToken = artifacts.require('./IDToken.sol')

contract('IDToken', function ([owner, visitor]) {
  let idToken
  let idTokenAddress

  beforeEach('setup contract for each test', async function () {
      idToken = await IDToken.new()
      idTokenAddress = await idToken.address
  })

  it('is initially deployed with no existing tokens (supply of 0)', async function () {
      assert.equal(await idToken.totalSupply(), 0)
  })

  it('lets a company record a new brand, then prove it owns that brand', async function () {
      tokenId = 123456
      name    = "Ralph Lauren"
      await idToken.recordID(tokenId, name)

      assert.equal(await idToken.totalSupply(), 1)
      assert.equal(await idToken.tokenName(123456), name)
      assert.equal(await idToken.ownerOf(123456), owner)
  })
})
