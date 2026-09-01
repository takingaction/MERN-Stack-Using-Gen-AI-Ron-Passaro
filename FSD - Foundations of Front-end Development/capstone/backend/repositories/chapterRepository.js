const Chapter = require("../models/chapterModel");

const create = async (chapterData) => {
    return await Chapter.create(chapterData);
};

const findById = async (id) => {
    return await Chapter.findById(id);
};

const findByCourseId = async (courseId) => {
    return await Chapter.find({ courseId }).sort({ order: 1 });
};

const findMaxOrder = async (courseId) => {
    const chapters = await Chapter.find({ courseId }).sort({ order: -1 }).limit(1);
    return chapters.length > 0 ? chapters[0].order : -1;
};

const update = async (id, updates) => {
    return await Chapter.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: Date.now() },
        { new: true }
    );
};

const deleteById = async (id) => {
    return await Chapter.findByIdAndDelete(id);
};

const deleteByCourseId = async (courseId) => {
    return await Chapter.deleteMany({ courseId });
};

const updateOrder = async (id, newOrder) => {
    return await Chapter.findByIdAndUpdate(
        id,
        { order: newOrder, updatedAt: Date.now() },
        { new: true }
    );
};

module.exports = {
    create,
    findById,
    findByCourseId,
    findMaxOrder,
    update,
    deleteById,
    deleteByCourseId,
    updateOrder
};