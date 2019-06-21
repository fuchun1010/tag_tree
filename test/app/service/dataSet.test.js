'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('test dataSets service', () => {

  it("should get datasets", async () => {
    const ctx = app.mockContext()
    const response = await ctx.service.dataSet.list()
    assert(response.length, 2)
  })
})