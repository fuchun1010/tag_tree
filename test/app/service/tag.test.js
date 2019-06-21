'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('test tag service', () => {

  it("/tags", async () => {
    const ctx = app.mockContext()
    const response = await ctx.service.tag.list()
    assert(response.length > 0)
  })

  it("/:id/tag", async () => {
    const ctx = app.mockContext()
    const id = '5b207565d762c43d029e4e18'
    const tag = await ctx.service.tag.queryTagById(id)
    const tagLevel = await ctx.service.dir.findDirLevel('tag_level')
    const isOk = tag && Object.keys(tag).length > 0 &&  (tagLevel && tagLevel.length > 0)
    assert(isOk)
  })

  it("/:tableName/:fieldName/fieldData" , async () => {
    const ctx = app.mockContext()
    const tableName = 'mem_market_tag_datail_record'
    const fieldName = 'register_channel'
    const response = await ctx.service.enums.findData(tableName, fieldName)
    assert(response && response.data && response.data.length > 0)
  })

  it("/tagLevel/List", async () => {
    const ctx = app.mockContext()
    const response = await ctx.service.dir.tagLevelList()
    assert(response && response.dataSetDirs && response.dataSetDirs.length > 0)
  })

})