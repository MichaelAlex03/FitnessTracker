const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../../config/s3Conn');
const { v4: uuidv4 } = require('uuid');


const getS3Url = async (req, res) => {
    const { fileType } = req.query;

    if (!fileType) {
        return res.status(400).json({ error: 'fileType is required' });
    }

    const fileExtension = fileType.split('/')[1];
    const key = `${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });

    try {
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

        const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        res.json({ uploadUrl, key, publicUrl });
    } catch (err) {
        console.error('Error generating signed URL:', err);
        res.status(500).json({ error: 'Could not generate signed URL' });
    }
}

const deleteOldProfileImage = async (req, res) => {
    const { key } = req.body

    await s3.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    }));

    res.status(200).json({"message": "old profile image deleted"});

}

module.exports = { getS3Url, deleteOldProfileImage }