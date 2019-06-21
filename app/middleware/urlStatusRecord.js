module.exports = (options, app) => {
    return async function urlStatusRecord(ctx, next) {
      const start = Date.now();
      let errMsg
      try {
        await next();
      } catch(err) {
        console.error(err)
        errMsg = err.message
      }
      const end = Date.now();
      let msg = `[URL-STATUS-RECORD] [REQUEST-URL] ${ctx.url}, [REQUEST-METHOD] ${ctx.method}, [STATUS-CODE] ${ctx.status}, [COST-TIME] ${end-start}ms`
      const logger = app.getLogger('urlStatusRecordLogger')
      if (errMsg) {
        msg += `, [FAILURE-REASON] ${errMsg}, [CTX-MESSAGE] ${ctx.message}`
      }
      logger.info(msg)
    }
  };

  