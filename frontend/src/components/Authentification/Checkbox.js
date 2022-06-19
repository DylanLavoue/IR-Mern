import React from "react";
import "./Checkbox.css";

const Checkbox = ({ id, value, onChange }) => {
    const _id ="checkbox" + id;
    return (
        <div id="container">
            <div class="toggle">
                <input type="checkbox" name="toggle" class="check-checkbox" id="mytoggle" checked={value} onChange={onChange}/>
                <label class="check-label" for="mytoggle">
                <div id="background"></div>
                <span class="face">
                    <span class="face-container">
                    <span class="eye left"></span>
                    <span class="eye right"></span>
                    <span class="mouth"></span>
                    </span>
                </span>
                </label>
            </div>
        </div>
    );
};

export default Checkbox;