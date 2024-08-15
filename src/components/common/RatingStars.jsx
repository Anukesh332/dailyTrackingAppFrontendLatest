import React from 'react';

const RatingStars = ({ count }) => {
    const filledStars = Math.round(count * 5) / 5;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= filledStars) {
            stars.push(<span key={i}>&#9733;</span>);
        } else {
            stars.push(<span key={i}>&#9734;</span>);
        }
    }

    return (
        <div>
            {stars}
        </div>
    );
};

export default RatingStars;