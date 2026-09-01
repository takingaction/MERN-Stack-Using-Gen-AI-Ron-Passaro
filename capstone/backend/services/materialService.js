const materialRepository = require("../repositories/materialRepository");
const courseRepository = require("../repositories/courseRepository");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const getDb = require("../config/db");

const FILE_SIZE_THRESHOLD = 16 * 1024 * 1024;

const getGridFSBucket = () => {
    const db = getDb();
    return new GridFSBucket(db, { bucketName: "materials" });
};

const determineFileType = (mimeType) => {
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "presentation";
    return "document";
};

const uploadMaterial = async (file, courseId, title, uploadedBy) => {
    const course = await courseRepository.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    const fileType = determineFileType(file.mimetype);
    const materialData = {
        courseId,
        title: title || file.originalname,
        fileName: file.originalname,
        fileType,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedBy
    };

    if (file.size > FILE_SIZE_THRESHOLD) {
        const bucket = getGridFSBucket();
        const gridFsFileId = await materialRepository.storeFileGridFS(bucket, file.buffer, file.originalname);
        materialData.gridFsFileId = new mongoose.Types.ObjectId(gridFsFileId);
    } else {
        materialData.data = file.buffer;
    }

    return await materialRepository.create(materialData);
};

const getMaterialsByCourse = async (courseId) => {
    return await materialRepository.findByCourseId(courseId);
};

const getMaterialFile = async (materialId) => {
    const material = await materialRepository.findById(materialId);
    if (!material) {
        throw new Error("Material not found");
    }

    let fileData;
    if (material.gridFsFileId) {
        const bucket = getGridFSBucket();
        fileData = await materialRepository.getFileFromGridFS(bucket, material.gridFsFileId);
    } else {
        fileData = material.data;
    }

    return {
        fileName: material.fileName,
        mimeType: material.mimeType,
        fileSize: material.fileSize,
        data: fileData
    };
};

const deleteMaterial = async (materialId, requestingUser, userType) => {
    const material = await materialRepository.findById(materialId);
    if (!material) {
        throw new Error("Material not found");
    }

    if (userType === "instructor" && material.uploadedBy !== requestingUser) {
        throw new Error("Not authorized to delete this material");
    }

    if (material.gridFsFileId) {
        const bucket = getGridFSBucket();
        try {
            await bucket.delete(material.gridFsFileId);
        } catch (e) {
            console.log("GridFS file may already be deleted");
        }
    }

    return await materialRepository.deleteMaterial(materialId);
};

module.exports = {
    uploadMaterial,
    getMaterialsByCourse,
    getMaterialFile,
    deleteMaterial
};
