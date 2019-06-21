'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/schema', controller.schema.index)
  //test curl -XGET "http://localhost:7001/datasets"
  router.get('/datasets', controller.dataset.list)
  //test curl -XGET "http://localhost:7001/dataset/mem_market_tag_datail_record/fields"
  //test curl -XGET "http://localhost:7001/dataset/mem_market_tag_sum/fields"
  router.get('/dataset/:name/fields', controller.dataset.fieldsByName)

  //test curl -XGET "http://localhost:7001/tags"
  router.get('/tags', controller.tag.tags)

  //test curl -XGET "http://localhost:7001/5c987b0d2abc201d129800a1/tag"
  router.get('/:id/tag', controller.tag.queryTagContent)

  //unit curl -XGET "http://localhost:7001/mem_market_tag_datail_record/member_type/fieldData"
  //unit curl -XGET "http://localhost:7001/mk_tag_rchg_order/rchg_city_code/fieldData"
  //unit curl -XGET "http://localhost:7001/mk_tag_mem_coupon_status/coupon_way/fieldData"
  router.get('/:tableName/:fieldName/fieldData', controller.enums.listEnums)
  // //unit test
  //这个/tagLevel/List应该注释掉,重新实现
  //curl -XGET "http://localhost:7001/tagLevel/List"
  router.get('/tagLevel/List', controller.dir.tagLevelList)
  router.get('/tags/:tagId/:pageCount/:pageNum', controller.tag.queryTagMappedUserInfo)
  //update dir tag level
  router.get('/helper/updateDir', controller.helper.updateDir)
  router.get('/import/history/tag', controller.tag.importHistoryTag)
  router.get('/import/dir/history/level', controller.tag.importDirHistory);

  //query plan tag level
  router.get("/tagLevel/flat/list", controller.tag.queryAllTagPlanLevel)

  
  router.post('/tag/create', controller.tag.create)
  router.post('/tag/preview/numbers', controller.tag.preview)
  
  router.post('/tagLevel/create', controller.dir.createRootDir)
  router.post('/tagLevel/:parentId/create', controller.dir.addDir)
  router.post('/tag-cron-trigger', controller.tag.triggerTagCron)
  router.post('/tags/search', controller.tag.search)

  router.delete('/:id/tag', controller.tag.delete)
  router.delete('/tagLevel/:id/delete', controller.dir.deleteTargetDir)

  router.delete("/tag/dirty/data", controller.tag.deleteDirtyData)

  router.put('/tagLevel/:id/update', controller.dir.changeTargetDir)
  router.put('/updateCount', controller.tag.updateCount)
};
