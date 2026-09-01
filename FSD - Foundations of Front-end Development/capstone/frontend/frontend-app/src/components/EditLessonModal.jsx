import { useState, useRef } from "react";
import Modal from "./Modal";

function EditLessonModal({ isOpen, onClose, onSave, lesson, chapterId }) {
    let [title, setTitle] = useState(lesson?.title || "");
    let [type, setType] = useState(lesson?.type || "text");
    let [content, setContent] = useState(lesson?.content || "");
    let [videoFile, setVideoFile] = useState(null);
    let [loading, setLoading] = useState(false);
    let [message, setMessage] = useState("");
    let videoInputRef = useRef(null);

    let isEditing = !!lesson;

    let handleTypeChange = (newType) => {
        setType(newType);
        if (newType === "text") {
            setVideoFile(null);
            if (videoInputRef.current) videoInputRef.current.value = "";
        }
    };

    let handleVideoChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    let handleSave = async () => {
        if (!title.trim()) {
            setMessage("Please enter a title");
            return;
        }

        if (type === "text" && !content.trim()) {
            setMessage("Please enter content for the lesson");
            return;
        }

        if (type === "video" && !isEditing && !videoFile) {
            setMessage("Please select a video file");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            let lessonData = {
                title: title.trim(),
                type,
                content: type === "text" ? content : ""
            };

            await onSave(lessonData, videoFile);
            handleClose();
        } catch (error) {
            setMessage(error.message || "Failed to save lesson");
        }

        setLoading(false);
    };

    let handleClose = () => {
        setTitle("");
        setType("text");
        setContent("");
        setVideoFile(null);
        setMessage("");
        if (videoInputRef.current) videoInputRef.current.value = "";
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditing ? "Edit Lesson" : "Add Lesson"}
            size="large"
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                    <label className="form-label">Lesson Title</label>
                    <input
                        className="input-field"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter lesson title"
                        style={{ width: "100%" }}
                    />
                </div>

                <div>
                    <label className="form-label">Lesson Type</label>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="lessonType"
                                value="text"
                                checked={type === "text"}
                                onChange={() => handleTypeChange("text")}
                            />
                            Text
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="lessonType"
                                value="video"
                                checked={type === "video"}
                                onChange={() => handleTypeChange("video")}
                            />
                            Video
                        </label>
                    </div>
                </div>

                {type === "text" && (
                    <div>
                        <label className="form-label">Content</label>
                        <textarea
                            className="input-field"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter lesson content"
                            rows={10}
                            style={{ width: "100%" }}
                        />
                    </div>
                )}

                {type === "video" && (
                    <div>
                        <label className="form-label">Video File</label>
                        <input
                            ref={videoInputRef}
                            className="input-field"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            style={{ width: "100%" }}
                        />
                        {lesson?.fileName && (
                            <p className="small-note" style={{ marginTop: "0.5rem" }}>
                                Current: {lesson.fileName}
                            </p>
                        )}
                        {videoFile && (
                            <p className="small-note" style={{ marginTop: "0.5rem", color: "green" }}>
                                New: {videoFile.name}
                            </p>
                        )}
                    </div>
                )}

                {message && <p className="msg-error">{message}</p>}

                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                    <button className="button ghost" type="button" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="button" type="button" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Lesson"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default EditLessonModal;