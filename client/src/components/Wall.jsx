import React from 'react';

const Wall = ({ side, highlightIndex, showDraw }) => {
    // Determine if it's a row (top/bottom) or column (left/right) based on side
    // However, simpler logic: just render images and let CSS handle the flex direction and layout

    // Determine image based on side
    const isHorizontalSide = side === 'left' || side === 'right';
    const baseImage = isHorizontalSide
        ? '/hand_images/facedown-horizontal.png'
        : '/hand_images/facedown-vertical.png';

    const yellowImage = isHorizontalSide
        ? '/hand_images/facedown-yellow-horizontal.png'
        : '/hand_images/facedown-yellow-vertical.png';

    const tiles = Array(18).fill(null);

    return (
        <div className={`wall-container wall-${side}`}>
            {tiles.map((_, index) => (
                <img
                    key={index}
                    src={(index === highlightIndex) ? yellowImage : baseImage}
                    alt="wall-tile"
                    className="wall-tile"
                />
            ))}
            {showDraw && (
                <img
                    src="/images/draw.png"
                    alt="Draw Arrow"
                    className="wall-draw-arrow"
                />
            )}
        </div>
    );
};

export default Wall;
