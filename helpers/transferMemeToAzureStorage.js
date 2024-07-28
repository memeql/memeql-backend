const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob')
const os = require("os")
const fs = require("fs")
const axios = require("axios")
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const downloadFile = async (sourceURL, destinationPath) => {
    console.log('downloading file')
    const response = await axios({url: sourceURL, method: "GET", responseType: 'stream'})
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(destinationPath))
            .on('error', reject)
            .once('close', () => resolve(destinationPath))
    })
}

async function uploadBlobFromLocalPath(blobServiceClient, blobName, localFilePath, containerName){
    console.log('uploading file')
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(localFilePath);
}

const transferFileToBlobStorage = async (sourceURL, blobClinent, containerName, imgUUID) => {
    const downloadPath = path.join(os.tmpdir(), imgUUID)
    await downloadFile(sourceURL, downloadPath)
    await uploadBlobFromLocalPath(blobClinent, imgUUID, downloadPath, containerName)
}

const handleFileTransferToBlobStorage = (sourceURL) => {
    const accountName = process.env.STORAGE_ACCOUNT_NAME
    const containerName = process.env.STORAGE_CONTAINER_NAME
    const accountKey = process.env.STORAGE_KEY
    const blobServiceURL = `https://${accountName}.blob.core.windows.net`
    
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
    const blobServiceClient = new BlobServiceClient(
        blobServiceURL,
        sharedKeyCredential
    );
    const imgUUID = uuidv4()
    transferFileToBlobStorage(sourceURL, blobServiceClient, containerName, imgUUID)
    return blobServiceURL + '/' + containerName + '/' + imgUUID
}

module.exports = {
    handleFileTransferToBlobStorage
}