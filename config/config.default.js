'use strict';
/* eslint-disable */
const path = require('path')
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1516863260308_870';

  // add your config here
  config.middleware = ['urlStatusRecord'];
  
  exports.mongoose = {
    url: 'mongodb://127.0.0.1/tag',
    options: {}
  };

  exports.security = {
    domainWhiteList: [ 'http://localhost:3010','http://123.207.18.36' ],
    csrf: {
      enable: false
    }
  };

  exports.cors = {
     allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
     credentials: true
  };

  config.customLogger = {
    urlStatusRecordLogger: {
      file: path.join(appInfo.root, 'logs/url-status-record.log')
    } 
  }

  config.privileges = {
    enable: true,
    dcEnable: true,
    urls: {
      dataSets: 'http://localhost:8080/dataSets',
      fieldsBy: (tableName) => {
        return `http://localhost:8080/dataSets/${tableName}/fields`
      },
      preview: 'http://localhost:8080/preview/tag',
      tagMappedUsers: (tagId, pageCount, pageNum) => {
        return `http://localhost:8080/tags/${tagId}?pageCount=${pageCount}&pageNum=${pageNum}`
      },
      createTag: 'http://localhost:8080/tag',
      deleteTag: (tagId) => {
        return `http://localhost:8080/delete/${tagId}/tag`
      },
      tagTreeUrl: 'http://localhost:10004/v1/tree',
      createItem: "http://localhost:10004/v1/add/node",
      deleteItem: (id) => `http://localhost:10004/v1/delete/${id}/node`,
      updateItem: (id,name)=>`http://localhost:10004/v1/update/${id}/node/${encodeURIComponent(name)}/name`
    }
  }

  return config;
};
