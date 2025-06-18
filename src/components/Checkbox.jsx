import React from "react";
import styled from "styled-components";

const Checkbox = ({ id, checked, onChange }) => {
  const inputId = `cbx-${id}`;

  return (
    <StyledWrapper>
      <div className="container">
        <input
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={onChange}
          style={{ display: "none" }}
        />
        <label htmlFor={inputId} className="check">
          <svg width="18px" height="18px" viewBox="0 0 18 18">
            <path d="M 1 9 C 1 4 4 1 9 1 C 14 1 17 5 17 9 C 17 14 13 17 9 17 C 5 17 1 14 1 9 Z" />
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .check {
    cursor: pointer;
    position: relative;
    width: 18px;
    height: 18px;
    display: inline-block;
  }

  .check:before {
    content: "";
    position: absolute;
    top: -15px;
    left: -15px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(34, 50, 84, 0.03);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .check svg {
    position: relative;
    z-index: 1;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #c8ccd4;
    stroke-width: 1.5;
    transition: all 0.2s ease;
  }

  .check svg path {
    stroke-dasharray: 60;
    stroke-dashoffset: 0;
  }

  .check svg polyline {
    stroke-dasharray: 22;
    stroke-dashoffset: 66;
  }

  .check:hover:before {
    opacity: 1;
  }

  .check:hover svg {
    stroke: var(--accent-color, #a3e583);
  }

  input:checked + .check svg {
    stroke: var(--accent-color, #a3e583);
  }

  input:checked + .check svg path {
    stroke-dashoffset: 60;
    transition: all 0.3s linear;
  }

  input:checked + .check svg polyline {
    stroke-dashoffset: 42;
    transition: all 0.2s linear;
    transition-delay: 0.15s;
  }
`;

export default Checkbox;
