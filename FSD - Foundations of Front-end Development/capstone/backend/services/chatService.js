const chatRepository = require("../repositories/chatRepository");
const courseRepository = require("../repositories/courseRepository");
const enrollmentRepository = require("../repositories/enrollmentRepository");

const getOrCreateChatRoom = async (courseId, userEmail) => {
    const course = await courseRepository.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    let chatRoom = await chatRepository.findByCourseId(courseId);
    if (!chatRoom) {
        chatRoom = await chatRepository.create(courseId);
    }

    const enrollment = await enrollmentRepository.findByStudentAndCourse(userEmail, courseId);
    const isInstructor = course.instructor === userEmail;
    const isApprovedStudent = enrollment && enrollment.status === "approved";

    if (!isInstructor && !isApprovedStudent) {
        throw new Error("You must be enrolled in this course to access the chat");
    }

    await chatRepository.addParticipant(chatRoom._id, userEmail);

    return chatRoom;
};

const getMessages = async (courseId, userEmail, limit = 100) => {
    const chatRoom = await getOrCreateChatRoom(courseId, userEmail);
    const messages = await chatRepository.getMessagesByRoomId(chatRoom._id, limit);
    return messages.reverse();
};

const postMessage = async (courseId, senderEmail, messageText) => {
    const chatRoom = await getOrCreateChatRoom(courseId, senderEmail);
    const messageData = {
        chatRoomId: chatRoom._id,
        senderEmail,
        message: messageText
    };
    return await chatRepository.createMessage(messageData);
};

const getChatRoomByCourseId = async (courseId) => {
    return await chatRepository.findByCourseId(courseId);
};

module.exports = {
    getOrCreateChatRoom,
    getMessages,
    postMessage,
    getChatRoomByCourseId
};
