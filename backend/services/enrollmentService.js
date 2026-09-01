const enrollmentRepository = require("../repositories/enrollmentRepository");
const courseRepository = require("../repositories/courseRepository");

const requestEnrollment = async (courseId, studentEmail) => {
    const course = await courseRepository.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    const existingEnrollment = await enrollmentRepository.findByStudentAndCourse(studentEmail, courseId);
    if (existingEnrollment) {
        if (existingEnrollment.status === "pending") {
            throw new Error("Enrollment request already pending");
        } else if (existingEnrollment.status === "approved") {
            throw new Error("Already enrolled in this course");
        } else {
            throw new Error("Enrollment request was rejected. Please request again.");
        }
    }

    const enrollmentData = {
        courseId,
        studentEmail,
        instructorEmail: course.instructor,
        status: "pending"
    };

    return await enrollmentRepository.create(enrollmentData);
};

const getStudentEnrollments = async (email) => {
    return await enrollmentRepository.findByStudentEmail(email);
};

const getPendingForInstructor = async (email) => {
    return await enrollmentRepository.findPendingByInstructorEmail(email);
};

const approveEnrollment = async (id, instructorEmail) => {
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) {
        throw new Error("Enrollment request not found");
    }
    if (enrollment.instructorEmail !== instructorEmail) {
        throw new Error("Not authorized to approve this enrollment");
    }
    if (enrollment.status !== "pending") {
        throw new Error("Enrollment already processed");
    }

    return await enrollmentRepository.updateStatus(id, "approved", instructorEmail);
};

const rejectEnrollment = async (id, instructorEmail) => {
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) {
        throw new Error("Enrollment request not found");
    }
    if (enrollment.instructorEmail !== instructorEmail) {
        throw new Error("Not authorized to reject this enrollment");
    }
    if (enrollment.status !== "pending") {
        throw new Error("Enrollment already processed");
    }

    return await enrollmentRepository.updateStatus(id, "rejected", instructorEmail);
};

const getApprovedCoursesForStudent = async (email) => {
    return await enrollmentRepository.findApprovedByStudentEmail(email);
};

module.exports = {
    requestEnrollment,
    getStudentEnrollments,
    getPendingForInstructor,
    approveEnrollment,
    rejectEnrollment,
    getApprovedCoursesForStudent
};
