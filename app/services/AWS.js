'use strict'

const url = require('url')
const path = require('path')

const AWS = require('aws-sdk')
const config = require('config')

const s3 = new AWS.S3({
  region: config.AWS_REGION,
  accessKeyId: config.AWS_KEY,
  secretAccessKey: config.AWS_SECRET,
})

/**
 * sign url
 * @param Key the s3 key
 * @returns {string}
 */
function signUrl(Key) {
  if (!Key || Key.indexOf('http') === 0) {
    return Key
  }
  return s3.getSignedUrl('getObject', {
    Bucket: config.AWS_S3_BUCKET,
    Key,
    Expires: 60 * 60 * 24,
  })
}

/**
 * upload to s3
 * @param file the file
 */
async function uploadToS3(file) {
  const Key = Date.now() + '-' + file.originalname
  const uploadParams = {
    Bucket: config.AWS_S3_BUCKET,
    Key,
    Body: file.buffer,
  }
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function(err, data) {
      if (err) {
        return reject(err)
      }
      if (data) {
        resolve(Key)
      }
    })
  })
}

/**
 * get key by url
 * @param urlStr the url
 */
function getKeyByUrl(urlStr) {
  if (!urlStr) {
    return urlStr
  }
  if (urlStr.indexOf('http') === 0) {
    const parsed = url.parse(urlStr)
    return path.basename(parsed.pathname)
  }
  return urlStr
}

module.exports = {
  uploadToS3,
  signUrl,
  getKeyByUrl,
}
