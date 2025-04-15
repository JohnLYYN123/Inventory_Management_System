// Put the DigitalOcean Spaces configuration here
const AWS = require('aws-sdk');

const spacesEndpoint = new AWS.Endpoint('tor1.digitaloceanspaces.com') // Update region if needed
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_KEY,
    secretAccessKey: process.env.DO_SPACE_SECRET
});

module.exports = s3;
