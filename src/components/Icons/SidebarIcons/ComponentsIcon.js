import React from 'react';

class ComponentsIcon extends React.Component {
    render() {
        return (
            <svg
                className={this.props.className}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Outer circle */}
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                />
                {/* Trend line */}
                <path
                    d="M6 16 L10 12 L14 14 L18 8"
                    stroke="blue"
                    strokeWidth="2"
                    fill="none"
                />
                {/* Upward arrow */}
                <path d="M18 8 L16.5 10 L19.5 10 Z" fill="blue" />
            </svg>
        );
    }
}

export default ComponentsIcon;
