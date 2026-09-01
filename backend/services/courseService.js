const courseRepository = require("../repositories/courseRepository");
const enrollmentRepository = require("../repositories/enrollmentRepository");
const materialRepository = require("../repositories/materialRepository");
const feedbackRepository = require("../repositories/feedbackRepository");
const chatRepository = require("../repositories/chatRepository");
const chapterService = require("./chapterService");
const lessonService = require("./lessonService");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { getDb } = require("../config/db");

const createCourse = async (title, description, instructor, duration) => {
    let existingCourse = await courseRepository.findByTitle(title);
    if (existingCourse) {
        throw new Error("Course with this title already exists");
    }
    const newCourse = await courseRepository.saveCourse({ title, description, instructor, duration });
    return newCourse;
};

const getAllCourses = async () => {
    return await courseRepository.findAllCourses();
};

const getCourseByTitle = async (title) => {
    let course = await courseRepository.findByTitle(title);
    if (!course) {
        throw new Error("Course not found");
    }
    return course;
};

const getCourseById = async (id) => {
    let course = await courseRepository.findById(id);
    if (!course) {
        throw new Error("Course not found");
    }
    return course;
};

const updateCourse = async (id, updates, requestingUser, userType) => {
    let course = await courseRepository.findById(id);
    if (!course) {
        throw new Error("Course not found");
    }

    if (userType === "instructor" && course.instructor !== requestingUser) {
        throw new Error("Not authorized to update this course");
    }

    let updatedCourse = await courseRepository.update(id, updates);
    return updatedCourse;
};

const getCoursesByInstructor = async (email) => {
    return await courseRepository.findByInstructorEmail(email);
};

const deleteCourse = async (id) => {
    console.log("Starting deleteCourse for id:", id);
    let course = await courseRepository.findById(id);
    console.log("Course found:", course);
    if (!course) {
        throw new Error("Course not found");
    }

    const db = getDb();
    console.log("Got database connection");
    const gridFSBucket = new GridFSBucket(db, { bucketName: "materials" });

    let enrollments = await enrollmentRepository.findByCourseId(id);
    console.log("Enrollments found:", enrollments.length);
    if (enrollments.length > 0) {
        await enrollmentRepository.deleteByCourseId(id);
        console.log("Deleted enrollments");
    }

    let materials = await materialRepository.findByCourseId(id);
    console.log("Materials found:", materials.length);
    for (let material of materials) {
        if (material.gridFsFileId) {
            try {
                await gridFSBucket.delete(material.gridFsFileId);
                console.log("Deleted GridFS file:", material.gridFsFileId);
            } catch (e) {
                console.log("GridFS file may already be deleted:", e.message);
            }
        }
    }
    await materialRepository.deleteByCourseId(id);
    console.log("Deleted materials from collection");

    await feedbackRepository.deleteByCourseId(id);
    console.log("Deleted feedback");

    await lessonService.deleteLessonsByCourse(id);
    console.log("Deleted lessons");

    await chapterService.deleteChaptersByCourse(id);
    console.log("Deleted chapters");

    let chatRoom = await chatRepository.findByCourseId(id);
    console.log("Chat room found:", chatRoom);
    if (chatRoom) {
        await chatRepository.deleteMessagesByRoomId(chatRoom._id);
        await chatRepository.deleteRoomByCourseId(id);
        console.log("Deleted chat room and messages");
    }

    let result = await courseRepository.deleteById(id);
    console.log("Deleted course, result:", result);
    return result;
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseByTitle,
    getCourseById,
    updateCourse,
    getCoursesByInstructor,
    deleteCourse
};
