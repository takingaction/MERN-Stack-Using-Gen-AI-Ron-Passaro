import { useState, useEffect } from "react";
import { getCourseById, updateCourse } from "../service/courseService";
import { getChaptersByCourse, createChapter, updateChapter, deleteChapter, reorderChapters } from "../service/chapterService";
import { getLessonsByChapter, createLesson, updateLesson, deleteLesson, reorderLessons } from "../service/lessonService";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";
import EditLessonModal from "./EditLessonModal";

function EditCourse({ courseId, onSuccess, onCancel, requestingUser, userType }) {
    let [course, setCourse] = useState(null);
    let [title, setTitle] = useState("");
    let [description, setDescription] = useState("");
    let [duration, setDuration] = useState("");
    let [message, setMessage] = useState("");
    let [loading, setLoading] = useState(true);

    let [activeTab, setActiveTab] = useState("details");

    let [chapters, setChapters] = useState([]);
    let [lessonsByChapter, setLessonsByChapter] = useState({});
    let [expandedChapters, setExpandedChapters] = useState({});

    let [newChapterTitle, setNewChapterTitle] = useState("");
    let [editingChapterId, setEditingChapterId] = useState(null);
    let [editingChapterTitle, setEditingChapterTitle] = useState("");

    let [lessonModalOpen, setLessonModalOpen] = useState(false);
    let [editingLesson, setEditingLesson] = useState(null);
    let [lessonChapterId, setLessonChapterId] = useState(null);

    let [deleteChapterId, setDeleteChapterId] = useState(null);
    let [deleteLessonId, setDeleteLessonId] = useState(null);
    let [isDeleting, setIsDeleting] = useState(false);

    let [successModalOpen, setSuccessModalOpen] = useState(false);
    let [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        loadCourse();
    }, [courseId]);

    useEffect(() => {
        if (activeTab === "content" && courseId) {
            loadChaptersAndLessons();
        }
    }, [activeTab, courseId]);

    let loadCourse = async () => {
        try {
            let result = await getCourseById(courseId);
            if (result.success) {
                setCourse(result.data);
                setTitle(result.data.title);
                setDescription(result.data.description);
                setDuration(result.data.duration);
                setLoading(false);
            } else {
                setMessage(result.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error loading course:", error);
            setLoading(false);
        }
    };

    let loadChaptersAndLessons = async () => {
        try {
            let result = await getChaptersByCourse(courseId);
            if (result.success) {
                setChapters(result.data);
                let expanded = {};
                let lessonsMap = {};
                for (const chapter of result.data) {
                    expanded[chapter._id] = true;
                    let lessonsResult = await getLessonsByChapter(chapter._id);
                    lessonsMap[chapter._id] = lessonsResult.success ? lessonsResult.data : [];
                }
                setExpandedChapters(expanded);
                setLessonsByChapter(lessonsMap);
            }
        } catch (error) {
            console.error("Error loading chapters:", error);
        }
    };

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let updates = { title, description, duration: Number(duration) };
            let result = await updateCourse(courseId, updates, requestingUser, userType);
            if (result.success) {
                setSuccessMessage("Course updated successfully!");
                setSuccessModalOpen(true);
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error updating course:", error);
            setMessage(error.message);
        }
    };

    let handleAddChapter = async () => {
        if (!newChapterTitle.trim()) return;
        try {
            let result = await createChapter(courseId, newChapterTitle.trim());
            if (result.success) {
                setNewChapterTitle("");
                await loadChaptersAndLessons();
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error creating chapter:", error);
            setMessage(error.message);
        }
    };

    let handleUpdateChapter = async (chapterId) => {
        if (!editingChapterTitle.trim()) return;
        try {
            let result = await updateChapter(chapterId, editingChapterTitle.trim());
            if (result.success) {
                setEditingChapterId(null);
                setEditingChapterTitle("");
                await loadChaptersAndLessons();
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error updating chapter:", error);
            setMessage(error.message);
        }
    };

    let handleDeleteChapter = async () => {
        if (!deleteChapterId) return;
        setIsDeleting(true);
        try {
            let result = await deleteChapter(deleteChapterId);
            if (result.success) {
                setDeleteChapterId(null);
                await loadChaptersAndLessons();
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error deleting chapter:", error);
            setMessage(error.message);
        }
        setIsDeleting(false);
    };

    let handleMoveChapter = async (chapterId, direction) => {
        let currentIndex = chapters.findIndex(c => c._id === chapterId);
        if (currentIndex === -1) return;
        if (direction === "up" && currentIndex === 0) return;
        if (direction === "down" && currentIndex === chapters.length - 1) return;

        let newChapters = [...chapters];
        let targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        [newChapters[currentIndex], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[currentIndex]];

        let orderedIds = newChapters.map(c => c._id);
        try {
            await reorderChapters(courseId, orderedIds);
            await loadChaptersAndLessons();
        } catch (error) {
            console.error("Error reordering chapters:", error);
        }
    };

    let handleOpenLessonModal = (chapterId, lesson = null) => {
        setLessonChapterId(chapterId);
        setEditingLesson(lesson);
        setLessonModalOpen(true);
    };

    let handleSaveLesson = async (lessonData, videoFile) => {
        if (editingLesson) {
            let result = await updateLesson(editingLesson._id, lessonData, videoFile);
            if (!result.success) {
                throw new Error(result.message);
            }
        } else {
            let result = await createLesson(lessonChapterId, lessonData, videoFile);
            if (!result.success) {
                throw new Error(result.message);
            }
        }
        await loadChaptersAndLessons();
    };

    let handleDeleteLesson = async () => {
        if (!deleteLessonId) return;
        setIsDeleting(true);
        try {
            let result = await deleteLesson(deleteLessonId);
            if (result.success) {
                setDeleteLessonId(null);
                await loadChaptersAndLessons();
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error deleting lesson:", error);
            setMessage(error.message);
        }
        setIsDeleting(false);
    };

    let handleMoveLesson = async (chapterId, lessonId, direction) => {
        let lessons = lessonsByChapter[chapterId] || [];
        let currentIndex = lessons.findIndex(l => l._id === lessonId);
        if (currentIndex === -1) return;
        if (direction === "up" && currentIndex === 0) return;
        if (direction === "down" && currentIndex === lessons.length - 1) return;

        let newLessons = [...lessons];
        let targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        [newLessons[currentIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[currentIndex]];

        let orderedIds = newLessons.map(l => l._id);
        try {
            await reorderLessons(chapterId, orderedIds);
            await loadChaptersAndLessons();
        } catch (error) {
            console.error("Error reordering lessons:", error);
        }
    };

    let toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };

    if (loading) {
        return <p>Loading course...</p>;
    }

    return (
        <div className="course-card">
            <h3>Edit Course</h3>
            <p className="small-note">Update the course details and content below.</p>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid #ddd" }}>
                <button
                    className={`button ${activeTab === "details" ? "" : "ghost"}`}
                    type="button"
                    onClick={() => setActiveTab("details")}
                    style={{ borderBottom: activeTab === "details" ? "2px solid #333" : "none" }}
                >
                    Details
                </button>
                <button
                    className={`button ${activeTab === "content" ? "" : "ghost"}`}
                    type="button"
                    onClick={() => setActiveTab("content")}
                    style={{ borderBottom: activeTab === "content" ? "2px solid #333" : "none" }}
                >
                    Content
                </button>
            </div>

            {message && <p className="msg-error">{message}</p>}

            {activeTab === "details" && (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label">Title</label>
                        <input
                            className="input-field"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label">Description</label>
                        <textarea
                            className="input-field"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label">Duration (hours)</label>
                        <input
                            className="input-field"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                            min="1"
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="button" type="submit">Update Course</button>
                        <button className="button ghost" type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            )}

            {activeTab === "content" && (
                <div>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h4 style={{ marginBottom: "0.5rem" }}>Add Chapter</h4>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                                className="input-field"
                                type="text"
                                value={newChapterTitle}
                                onChange={(e) => setNewChapterTitle(e.target.value)}
                                placeholder="New chapter title"
                                style={{ flex: 1 }}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddChapter())}
                            />
                            <button className="button" type="button" onClick={handleAddChapter}>Add</button>
                        </div>
                    </div>

                    {chapters.length === 0 ? (
                        <p className="small-note">No chapters yet. Add a chapter to get started.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {chapters.map((chapter, index) => (
                                <div key={chapter._id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                        <button
                                            className="button ghost small"
                                            onClick={() => toggleChapter(chapter._id)}
                                            style={{ padding: "0.25rem 0.5rem" }}
                                        >
                                            {expandedChapters[chapter._id] ? "▼" : "▶"}
                                        </button>

                                        {editingChapterId === chapter._id ? (
                                            <input
                                                className="input-field"
                                                type="text"
                                                value={editingChapterTitle}
                                                onChange={(e) => setEditingChapterTitle(e.target.value)}
                                                style={{ flex: 1 }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleUpdateChapter(chapter._id);
                                                    if (e.key === "Escape") setEditingChapterId(null);
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <h4 style={{ flex: 1, margin: 0 }}>{chapter.title}</h4>
                                        )}

                                        <button
                                            className="button ghost small"
                                            onClick={() => handleMoveChapter(chapter._id, "up")}
                                            disabled={index === 0}
                                            title="Move up"
                                        >↑</button>
                                        <button
                                            className="button ghost small"
                                            onClick={() => handleMoveChapter(chapter._id, "down")}
                                            disabled={index === chapters.length - 1}
                                            title="Move down"
                                        >↓</button>

                                        <button
                                            className="button ghost small"
                                            onClick={() => {
                                                setEditingChapterId(chapter._id);
                                                setEditingChapterTitle(chapter.title);
                                            }}
                                            title="Edit"
                                        >✏️</button>

                                        <button
                                            className="button ghost small"
                                            onClick={() => setDeleteChapterId(chapter._id)}
                                            title="Delete"
                                        >🗑️</button>
                                    </div>

                                    <div style={{ marginLeft: "2rem" }}>
                                        <button
                                            className="button ghost small"
                                            onClick={() => handleOpenLessonModal(chapter._id)}
                                            style={{ marginTop: "0.5rem" }}
                                        >
                                            + Add Lesson
                                        </button>

                                        {expandedChapters[chapter._id] && lessonsByChapter[chapter._id]?.length > 0 && (
                                            <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                {lessonsByChapter[chapter._id].map((lesson, lessonIndex) => (
                                                    <div key={lesson._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", background: "#f9f9f9", borderRadius: "4px" }}>
                                                        <span>{lesson.type === "video" ? "🎬" : "📄"}</span>
                                                        <span style={{ flex: 1 }}>{lesson.title}</span>
                                                        <button
                                                            className="button ghost small"
                                                            onClick={() => handleMoveLesson(chapter._id, lesson._id, "up")}
                                                            disabled={lessonIndex === 0}
                                                        >↑</button>
                                                        <button
                                                            className="button ghost small"
                                                            onClick={() => handleMoveLesson(chapter._id, lesson._id, "down")}
                                                            disabled={lessonIndex === lessonsByChapter[chapter._id].length - 1}
                                                        >↓</button>
                                                        <button
                                                            className="button ghost small"
                                                            onClick={() => handleOpenLessonModal(chapter._id, lesson)}
                                                        >✏️</button>
                                                        <button
                                                            className="button ghost small"
                                                            onClick={() => setDeleteLessonId(lesson._id)}
                                                        >🗑️</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ marginTop: "1rem" }}>
                        <button className="button ghost" type="button" onClick={onCancel}>Back to Course List</button>
                    </div>
                </div>
            )}

            <EditLessonModal
                isOpen={lessonModalOpen}
                onClose={() => { setLessonModalOpen(false); setEditingLesson(null); }}
                onSave={handleSaveLesson}
                lesson={editingLesson}
                chapterId={lessonChapterId}
            />

            <ConfirmModal
                isOpen={!!deleteChapterId}
                title="Delete Chapter"
                message="Are you sure you want to delete this chapter? All lessons within it will also be deleted. This action cannot be undone."
                onClose={() => setDeleteChapterId(null)}
                onConfirm={handleDeleteChapter}
                isDeleting={isDeleting}
            />

            <ConfirmModal
                isOpen={!!deleteLessonId}
                title="Delete Lesson"
                message="Are you sure you want to delete this lesson? This action cannot be undone."
                onClose={() => setDeleteLessonId(null)}
                onConfirm={handleDeleteLesson}
                isDeleting={isDeleting}
            />

            <Modal
                isOpen={successModalOpen}
                title="Success"
                onClose={() => { setSuccessModalOpen(false); if (onSuccess) onSuccess(); }}
            >
                {successMessage}
            </Modal>
        </div>
    );
}

export default EditCourse;