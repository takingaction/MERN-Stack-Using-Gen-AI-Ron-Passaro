const lessonProgressRepository = require("../repositories/lessonProgressRepository");
const lessonRepository = require("../repositories/lessonRepository");

const markComplete = async (lessonId, courseId, studentEmail) => {
    const existing = await lessonProgressRepository.findByStudentAndLesson(studentEmail, lessonId);
    if (existing) {
        return existing;
    }

    const progressData = {
        studentEmail,
        lessonId,
        courseId,
        completedAt: new Date()
    };

    return await lessonProgressRepository.create(progressData);
};

const unmarkComplete = async (lessonId, studentEmail) => {
    return await lessonProgressRepository.deleteByStudentAndLesson(studentEmail, lessonId);
};

const getCourseProgress = async (courseId, studentEmail) => {
    const completedLessons = await lessonProgressRepository.findByStudentAndCourse(studentEmail, courseId);
    const allLessons = await lessonRepository.findByCourseId(courseId);

    const completedCount = completedLessons.length;
    const totalCount = allLessons.length;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
        completedCount,
        totalCount,
        percent,
        completedLessonIds: completedLessons.map(p => p.lessonId.toString())
    };
};

const isLessonComplete = async (lessonId, studentEmail) => {
    const progress = await lessonProgressRepository.findByStudentAndLesson(studentEmail, lessonId);
    return !!progress;
};

module.exports = {
    markComplete,
    unmarkComplete,
    getCourseProgress,
    isLessonComplete
};