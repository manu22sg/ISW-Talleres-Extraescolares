import React  from 'react';
import { useState } from 'react';
import '../styles/Accordion.css'; 

const Accordion = ({ title, children }) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion">
            <div className="accordion-header" onClick={toggleAccordion}>
                <h2>{title}</h2>
                <span className="accordion-symbol">{isOpen ? '-' : '+'}</span>
            </div>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};

export default Accordion;