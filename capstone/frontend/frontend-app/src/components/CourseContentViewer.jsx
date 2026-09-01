import { useState, useEffect } from "react";
import { getCourseContent, getLessonVideoUrl } from "../service/lessonService";
import { markLessonComplete, unmarkLessonComplete, getCourseProgress } from "../service/progressService";
import CourseChat from "./CourseChat";
import CourseReviews from "./CourseReviews";
import Modal from "./Modal";

function CourseContentViewer({ courseId, studentEmail, courseTitle, onClose }) {
    let [chapters, setChapters] = useState([]);
    let [completedLessonIds, setCompletedLessonIds] = useState(new Set());
    let [selectedLesson, setSelectedLesson] = useState(null);
    let [loading, setLoading] = useState(true);
    let [courseProgress, setCourseProgress] = useState({ completedCount: 0, totalCount: 0, percent: 0 });
    let [expandedChapters, setExpandedChapters] = useState({});
    let [showChatModal, setShowChatModal] = useState(false);
    let [showReviewsModal, setShowReviewsModal] = useState(false);

    useEffect(() => {
        loadContent();
        loadProgress();
    }, [courseId, studentEmail]);

    let loadContent = async () => {
        try {
            setLoading(true);
            let result = await getCourseContent(courseId);
            if (result.success) {
                setChapters(result.data);
                let expanded = {};
                result.data.forEach((chapter, index) => {
                    expanded[chapter._id] = index === 0;
                });
                setExpandedChapters(expanded);

                if (result.data.length > 0 && result.data[0].lessons.length > 0) {
                    setSelectedLesson(result.data[0].lessons[0]);
                }
            }
        } catch (error) {
            console.error("Error loading course content:", error);
        }
        setLoading(false);
    };

    let loadProgress = async () => {
        try {
            let result = await getCourseProgress(courseId, studentEmail);
            if (result.success) {
                setCourseProgress({
                    completedCount: result.data.completedCount,
                    totalCount: result.data.totalCount,
                    percent: result.data.percent
                });
                setCompletedLessonIds(new Set(result.data.completedLessonIds));
            }
        } catch (error) {
            console.error("Error loading progress:", error);
        }
    };

    let toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };

    let handleMarkComplete = async () => {
        if (!selectedLesson) return;
        try {
            let result = await markLessonComplete(selectedLesson._id, courseId, studentEmail);
            if (result.success) {
                setCompletedLessonIds(prev => new Set([...prev, selectedLesson._id]));
                loadProgress();
            }
        } catch (error) {
            console.error("Error marking lesson complete:", error);
        }
    };

    let handleUnmarkComplete = async () => {
        if (!selectedLesson) return;
        try {
            let result = await unmarkLessonComplete(selectedLesson._id, studentEmail);
            if (result.success) {
                setCompletedLessonIds(prev => {
                    let newSet = new Set(prev);
                    newSet.delete(selectedLesson._id);
                    return newSet;
                });
                loadProgress();
            }
        } catch (error) {
            console.error("Error unmarking lesson complete:", error);
        }
    };

    let isLessonComplete = (lessonId) => {
        return completedLessonIds.has(lessonId);
    };

    if (loading) {
        return <div className="course-card"><p>Loading course content...</p></div>;
    }

    return (
        <div className="course-card" style={{ padding: 0 }}>
            <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
                <button
                    className="button ghost"
                    onClick={onClose}
                    style={{ borderRadius: 0 }}
                >
                    ← Back
                </button>
                <div style={{ flex: 1, padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ margin: 0 }}>{courseTitle}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span>{courseProgress.percent}% Complete</span>
                        <div style={{ width: "100px", height: "8px", background: "#eee", borderRadius: "4px" }}>
                            <div style={{ width: `${courseProgress.percent}%`, height: "100%", background: courseProgress.percent === 100 ? "#4CAF50" : "#2196F3", borderRadius: "4px" }} />
                        </div>
                        <button
                            className="button"
                            onClick={() => setShowChatModal(true)}
                        >
                            Chat
                        </button>
                        <button
                            className="button"
                            onClick={() => setShowReviewsModal(true)}
                        >
                            Reviews
                        </button>
                    </div>
                </div>
            </div>

            {courseProgress.percent === 100 && (
                <div style={{ background: "#4CAF50", color: "white", padding: "0.5rem", textAlign: "center" }}>
                    🎉 Course Completed!
                </div>
            )}

            <div style={{ display: "flex", minHeight: "500px" }}>
                <div style={{ width: "280px", borderRight: "1px solid #ddd", padding: "1rem", background: "#f9f9f9" }}>
                    <h4 style={{ marginTop: 0 }}>Chapters</h4>
                    {chapters.map((chapter) => (
                        <div key={chapter._id} style={{ marginBottom: "0.5rem" }}>
                            <div
                                onClick={() => toggleChapter(chapter._id)}
                                style={{
                                    padding: "0.5rem",
                                    cursor: "pointer",
                                    background: expandedChapters[chapter._id] ? "#e0e0e0" : "transparent",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem"
                                }}
                            >
                                <span>{expandedChapters[chapter._id] ? "▼" : "▶"}</span>
                                <span style={{ fontWeight: 500 }}>{chapter.title}</span>
                            </div>
                            {expandedChapters[chapter._id] && (
                                <div style={{ marginLeft: "1.5rem", marginTop: "0.25rem" }}>
                                    {chapter.lessons.map((lesson) => (
                                        <div
                                            key={lesson._id}
                                            onClick={() => setSelectedLesson(lesson)}
                                            style={{
                                                padding: "0.5rem",
                                                cursor: "pointer",
                                                background: selectedLesson?._id === lesson._id ? "#ddd" : "transparent",
                                                borderRadius: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem"
                                            }}
                                        >
                                            <span>{lesson.type === "video" ? "🎬" : "📄"}</span>
                                            <span style={{ flex: 1 }}>{lesson.title}</span>
                                            {isLessonComplete(lesson._id) && <span style={{ color: "#4CAF50" }}>✓</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ flex: 1, padding: "1.5rem" }}>
                    {selectedLesson ? (
                        <div>
                            <h2 style={{ marginTop: 0 }}>{selectedLesson.title}</h2>

                            {selectedLesson.type === "text" ? (
                                <div
                                    style={{
                                        background: "#f9f9f9",
                                        padding: "1.5rem",
                                        borderRadius: "8px",
                                        minHeight: "300px",
                                        whiteSpace: "pre-wrap",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {selectedLesson.content || "No content available."}
                                </div>
                            ) : (
                                <div style={{ marginBottom: "1rem" }}>
                                    <video
                                        controls
                                        style={{ width: "100%", maxHeight: "400px", background: "#000" }}
                                        src={getLessonVideoUrl(selectedLesson._id)}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}

                            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
                                {isLessonComplete(selectedLesson._id) ? (
                                    <button className="button" onClick={handleUnmarkComplete}>
                                        ✓ Completed - Click to Unmark
                                    </button>
                                ) : (
                                    <button className="button" onClick={handleMarkComplete}>
                                        Mark as Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: "#666" }}>Select a lesson from the sidebar to view its content.</p>
                    )}
                </div>
            </div>
            <Modal
                isOpen={showChatModal}
                onClose={() => setShowChatModal(false)}
                title="Course Chat"
                size="large"
            >
                <CourseChat
                    courseId={courseId}
                    userEmail={studentEmail}
                />
            </Modal>
            <Modal
                isOpen={showReviewsModal}
                onClose={() => setShowReviewsModal(false)}
                title="Course Reviews"
                size="large"
            >
                <CourseReviews
                    courseId={courseId}
                    studentEmail={studentEmail}
                    canReview={true}
                />
            </Modal>
        </div>
    );
}

export default CourseContentViewer;