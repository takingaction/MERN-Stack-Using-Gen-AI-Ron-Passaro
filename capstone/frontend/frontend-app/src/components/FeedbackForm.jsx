import { useState, useEffect } from "react";
import { submitFeedback, checkHasFeedback } from "../service/feedbackService";
import StarRating from "./StarRating";
import Modal from "./Modal";

function FeedbackForm({ courseId, studentEmail, onSuccess }) {
    let [rating, setRating] = useState(0);
    let [comment, setComment] = useState("");
    let [message, setMessage] = useState("");
    let [loading, setLoading] = useState(false);
    let [alreadyReviewed, setAlreadyReviewed] = useState(false);
    let [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        checkIfReviewed();
    }, [courseId, studentEmail]);

    let checkIfReviewed = async () => {
        try {
            let result = await checkHasFeedback(courseId, studentEmail);
            if (result.success && result.data.hasFeedback) {
                setAlreadyReviewed(true);
                setMessage("You have already submitted feedback for this course.");
            }
        } catch (error) {
            console.error("Error checking feedback:", error);
        }
    };

    let handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setMessage("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            setMessage("Please write a comment");
            return;
        }

        setLoading(true);
        try {
            let result = await submitFeedback(courseId, studentEmail, rating, comment);
            if (result.success) {
                setShowSuccessModal(true);
                setRating(0);
                setComment("");
                setMessage("");
                if (onSuccess) onSuccess();
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setMessage(error.message);
        }
        setLoading(false);
    };

    if (alreadyReviewed) {
        return (
            <div className="feedback-form" style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
                <p className="small-note">{message}</p>
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} style={{ padding: "1rem", background: "#f9f9f9", borderRadius: "8px" }}>
                <h4>Write a Review</h4>
                <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label">Rating</label>
                    <StarRating value={rating} onChange={setRating} />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label">Comment</label>
                    <textarea
                        className="input-field"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this course..."
                        rows="4"
                        style={{ width: "100%" }}
                    />
                </div>
                {message && <p className="msg-error" style={{ marginBottom: "1rem" }}>{message}</p>}
                <button className="button" type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Feedback"}
                </button>
            </form>
            <Modal
                isOpen={showSuccessModal}
                title="Success"
                onClose={() => setShowSuccessModal(false)}
            >
                Feedback submitted successfully!
            </Modal>
        </>
    );
}

export default FeedbackForm;
