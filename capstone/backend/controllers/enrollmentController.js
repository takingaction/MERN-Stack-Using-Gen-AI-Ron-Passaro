const enrollmentService = require("../services/enrollmentService");

const requestEnrollment = async (req, res) => {
    try {
        const { courseId, studentEmail } = req.body;
        const enrollment = await enrollmentService.requestEnrollment(courseId, studentEmail);
        res.status(201).json({
            success: true,
            data: enrollment,
            message: "Enrollment request submitted successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getStudentEnrollments = async (req, res) => {
    try {
        const { email } = req.params;
        const enrollments = await enrollmentService.getStudentEnrollments(email);
        res.status(200).json({
            success: true,
            data: enrollments,
            message: "Enrollments retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getPendingForInstructor = async (req, res) => {
    try {
        const { email } = req.params;
        const enrollments = await enrollmentService.getPendingForInstructor(email);
        res.status(200).json({
            success: true,
            data: enrollments,
            message: "Pending enrollments retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const approveEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const { instructorEmail } = req.body;
        const enrollment = await enrollmentService.approveEnrollment(id, instructorEmail);
        res.status(200).json({
            success: true,
            data: enrollment,
            message: "Enrollment approved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const rejectEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const { instructorEmail } = req.body;
        const enrollment = await enrollmentService.rejectEnrollment(id, instructorEmail);
        res.status(200).json({
            success: true,
            data: enrollment,
            message: "Enrollment rejected successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getApprovedCoursesForStudent = async (req, res) => {
    try {
        const { email } = req.params;
        const enrollments = await enrollmentService.getApprovedCoursesForStudent(email);
        res.status(200).json({
            success: true,
            data: enrollments,
            message: "Approved enrollments retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    requestEnrollment,
    getStudentEnrollments,
    getPendingForInstructor,
    approveEnrollment,
    rejectEnrollment,
    getApprovedCoursesForStudent
};
