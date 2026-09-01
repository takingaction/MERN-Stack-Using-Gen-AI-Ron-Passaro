const Lesson = require("../models/lessonModel");
const mongoose = require("mongoose");

const create = async (lessonData) => {
    return await Lesson.create(lessonData);
};

const findById = async (id) => {
    return await Lesson.findById(id);
};

const findByChapterId = async (chapterId) => {
    return await Lesson.find({ chapterId }).sort({ order: 1 });
};

const findByCourseId = async (courseId) => {
    return await Lesson.find({ courseId }).sort({ order: 1 });
};

const findMaxOrder = async (chapterId) => {
    const lessons = await Lesson.find({ chapterId }).sort({ order: -1 }).limit(1);
    return lessons.length > 0 ? lessons[0].order : -1;
};

const update = async (id, updates) => {
    return await Lesson.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: Date.now() },
        { new: true }
    );
};

const deleteById = async (id) => {
    return await Lesson.findByIdAndDelete(id);
};

const deleteByChapterId = async (chapterId) => {
    return await Lesson.deleteMany({ chapterId });
};

const deleteByCourseId = async (courseId) => {
    return await Lesson.deleteMany({ courseId });
};

const deleteByIds = async (ids) => {
    return await Lesson.deleteMany({ _id: { $in: ids } });
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

module.exports = {
    create,
    findById,
    findByChapterId,
    findByCourseId,
    findMaxOrder,
    update,
    deleteById,
    deleteByChapterId,
    deleteByCourseId,
    deleteByIds,
    getFileFromGridFS,
    storeFileGridFS
};