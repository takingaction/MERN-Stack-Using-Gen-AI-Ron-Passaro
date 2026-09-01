const mongoose = require("mongoose");
const path = require("path");

const Material = require("../models/materialModel");
const { GridFSBucket } = require("mongodb");

const FILE_SIZE_THRESHOLD = 16 * 1024 * 1024;

const create = async (materialData) => {
    return await Material.create(materialData);
};

const findByCourseId = async (courseId) => {
    return await Material.find({ courseId }).sort({ uploadedAt: -1 });
};

const findById = async (id) => {
    return await Material.findById(id);
};

const findByGridFsId = async (gridFsFileId) => {
    return await Material.findOne({ gridFsFileId });
};

const deleteMaterial = async (id) => {
    return await Material.findByIdAndDelete(id);
};

const getFileFromGridFS = async (bucket, fileId) => {
    return new Promise((resolve, reject) => {
        let downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
        let chunks = [];
        downloadStream.on("data", (chunk) => chunks.push(chunk));
        downloadStream.on("end", () => resolve(Buffer.concat(chunks)));
        downloadStream.on("error", reject);
    });
};

const storeFileGridFS = async (bucket, fileBuffer, filename) => {
    return new Promise((resolve, reject) => {
        let uploadStream = bucket.openUploadStream(filename);
        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", reject);
        uploadStream.write(fileBuffer);
        uploadStream.end();
    });
};

const deleteByCourseId = async (courseId) => {
    return await Material.deleteMany({ courseId });
};

module.exports = {
    create,
    findByCourseId,
    findById,
    findByGridFsId,
    deleteMaterial,
    getFileFromGridFS,
    storeFileGridFS,
    FILE_SIZE_THRESHOLD,
    deleteByCourseId
};
