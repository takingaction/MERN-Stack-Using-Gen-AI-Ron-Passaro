import { useState } from "react";

function StarRating({ value, onChange, readonly = false }) {
    let [hover, setHover] = useState(0);

    if (readonly) {
        return (
            <div className="star-rating" style={{ display: "inline-flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        style={{
                            color: star <= value ? "#ffc107" : "#e4e5e9",
                            fontSize: "1.2rem"
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    }

    return (
        <div className="star-rating" style={{ display: "inline-flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => onChange && onChange(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    style={{
                        color: star <= (hover || value) ? "#ffc107" : "#e4e5e9",
                        fontSize: "1.5rem",
                        cursor: readonly ? "default" : "pointer"
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export default StarRating;
