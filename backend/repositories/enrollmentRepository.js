const Enrollment = require("../models/enrollmentModel");

const create = async (enrollmentData) => {
    return await Enrollment.create(enrollmentData);
};

const findByStudentEmail = async (email) => {
    return await Enrollment.find({ studentEmail: email }).sort({ requestedAt: -1 });
};

const findByCourseId = async (courseId) => {
    return await Enrollment.find({ courseId }).sort({ requestedAt: -1 });
};

const findById = async (id) => {
    return await Enrollment.findById(id);
};

const findPendingByInstructorEmail = async (email) => {
    return await Enrollment.find({ instructorEmail: email, status: "pending" }).sort({ requestedAt: -1 });
};

const findApprovedByStudentEmail = async (email) => {
    return await Enrollment.find({ studentEmail: email, status: "approved" });
};

const updateStatus = async (id, status, processedBy) => {
    return await Enrollment.findByIdAndUpdate(
        id,
        {
            status,
            processedAt: Date.now(),
            processedBy
        },
        { new: true }
    );
};

const findByStudentAndCourse = async (studentEmail, courseId) => {
    return await Enrollment.findOne({ studentEmail, courseId });
};

const deleteByCourseId = async (courseId) => {
    return await Enrollment.deleteMany({ courseId });
};

module.exports = {
    create,
    findByStudentEmail,
    findByCourseId,
    findById,
    findPendingByInstructorEmail,
    findApprovedByStudentEmail,
    updateStatus,
    findByStudentAndCourse,
    deleteByCourseId
};
