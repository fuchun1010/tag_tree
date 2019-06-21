const axios = require('axios')
/**
 * 
 * @param {String} name cron任务名
 * @param {String} cron cron eg: * * * * *
 * @param {String} tagId ObjectId
 */
module.exports.createCronJob = async function(name, cron, tagId) {
    return await axios.post('http://localhost:3001/api/jobs/create/url-task', {
        "categoryName":"URL",
        "jobSchedule": "",
        "taskName": name,
        "jobRepeatEvery": cron,
        "jobData": {
            "method":"POST",
            "url":"http://localhost:7001/tag-cron-trigger",
            "body":{
                "tagId": tagId
            },
            "json":true
        }
    })
}
/**
 * 
 * @param {String} id ObjectId
 */
module.exports.deleteCronJob = async function(id) {
    return await axios.post('http://localhost:3001/api/jobs/delete', {
        jobIds: [id]
    })
}

module.exports.notifyDC2Calculate = async function(tag, url) {
    return axios.post(url, tag)
}