const { S3Client, ListBucketCommands } = require('@aws-sdk/client-s3');

const s3 = new S3Client({

});

module.exports = { s3 }