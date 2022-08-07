import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain.png'
const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='Tilt br2 shadow-2' options={{ max: 25}} style={{ height:150, width:150}}>
                <div className="pa3"><img style={{paddingTop:'5px',height:100, width:100}}alt='logo' src={brain}></img></div>
            </Tilt>
        </div>
    );
}

export default Logo;