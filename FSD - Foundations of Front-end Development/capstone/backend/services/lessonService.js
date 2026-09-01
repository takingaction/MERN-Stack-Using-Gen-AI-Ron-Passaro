const lessonRepository = require("../repositories/lessonRepository");
const chapterRepository = require("../repositories/chapterRepository");
const courseRepository = require("../repositories/courseRepository");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { getDb } = require("../config/db");

const FILE_SIZE_THRESHOLD = 16 * 1024 * 1024;

const getGridFSBucket = () => {
    const db = getDb();
    return new GridFSBucket(db, { bucketName: "materials" });
};

const createLesson = async (lessonData, videoFile = null) => {
    const chapter = await chapterRepository.findById(lessonData.chapterId);
    if (!chapter) {
        throw new Error("Chapter not found");
    }

    const course = await courseRepository.findById(chapter.courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    const maxOrder = await lessonRepository.findMaxOrder(lessonData.chapterId);
    const lesson = {
        ...lessonData,
        courseId: chapter.courseId,
        order: maxOrder + 1
    };

    if (videoFile) {
        const bucket = getGridFSBucket();
        const gridFsFileId = await lessonRepository.storeFileGridFS(bucket, videoFile.buffer, videoFile.originalname);
        lesson.gridFsFileId = new mongoose.Types.ObjectId(gridFsFileId);
        lesson.fileName = videoFile.originalname;
        lesson.mimeType = videoFile.mimetype;
        lesson.fileSize = videoFile.size;
    }

    return await lessonRepository.create(lesson);
};

const getLessonsByChapter = async (chapterId) => {
    return await lessonRepository.findByChapterId(chapterId);
};

const getLessonsByCourse = async (courseId) => {
    return await lessonRepository.findByCourseId(courseId);
};

const getLessonById = async (id) => {
    return await lessonRepository.findById(id);
};

const updateLesson = async (id, updates, videoFile = null) => {
    const lesson = await lessonRepository.findById(id);
    if (!lesson) {
        throw new Error("Lesson not found");
    }

    if (videoFile) {
        if (lesson.gridFsFileId) {
            const bucket = getGridFSBucket();
            try {
                await bucket.delete(lesson.gridFsFileId);
            } catch (e) {
                console.log("GridFS file may already be deleted");
            }
        }

        const bucket = getGridFSBucket();
        const gridFsFileId = await lessonRepository.storeFileGridFS(bucket, videoFile.buffer, videoFile.originalname);
        updates.gridFsFileId = new mongoose.Types.ObjectId(gridFsFileId);
        updates.fileName = videoFile.originalname;
        updates.mimeType = videoFile.mimetype;
        updates.fileSize = videoFile.size;
    }

    return await lessonRepository.update(id, updates);
};

const reorderLessons = async (chapterId, orderedIds) => {
    const updates = orderedIds.map((id, index) => {
        return lessonRepository.update(id, { order: index });
    });
    return await Promise.all(updates);
};

const deleteLesson = async (id) => {
    const lesson = await lessonRepository.findById(id);
    if (!lesson) {
        throw new Error("Lesson not found");
    }

    if (lesson.gridFsFileId) {
        const bucket = getGridFSBucket();
        try {
            await bucket.delete(lesson.gridFsFileId);
        } catch (e) {
            console.log("GridFS file may already be deleted");
        }
    }

    return await lessonRepository.deleteById(id);
};

const deleteLessonsByCourse = async (courseId) => {
    const lessons = await lessonRepository.findByCourseId(courseId);
    const bucket = getGridFSBucket();

    for (const lesson of lessons) {
        if (lesson.gridFsFileId) {
            try {
                await bucket.delete(lesson.gridFsFileId);
            } catch (e) {
                console.log("GridFS file may already be deleted");
            }
        }
    }

    return await lessonRepository.deleteByCourseId(courseId);
};

const getLessonVideo = async (lessonId) => {
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson) {
        throw new Error("Lesson not found");
    }

    if (!lesson.gridFsFileId) {
        throw new Error("No video file for this lesson");
    }

    const bucket = getGridFSBucket();
    const fileData = await lessonRepository.getFileFromGridFS(bucket, lesson.gridFsFileId);

    return {
        fileName: lesson.fileName,
        mimeType: lesson.mimeType,
        fileSize: lesson.fileSize,
        data: fileData
    };
};

const getCourseContent = async (courseId) => {
    const chapters = await chapterRepository.findByCourseId(courseId);
    const result = [];

    for (const chapter of chapters) {
        const lessons = await lessonRepository.findByChapterId(chapter._id);
        result.push({
            _id: chapter._id,
            title: chapter.title,
            order: chapter.order,
            lessons: lessons.map(l => ({
                _id: l._id,
                title: l.title,
                type: l.type,
                content: l.content || "",
                fileName: l.fileName,
                mimeType: l.mimeType,
                order: l.order
            }))
        });
    }

    return result;
};

module.exports = {
    createLesson,
    getLessonsByChapter,
    getLessonsByCourse,
    getLessonById,
    updateLesson,
    reorderLessons,
    deleteLesson,
    deleteLessonsByCourse,
    getLessonVideo,
    getCourseContent
};