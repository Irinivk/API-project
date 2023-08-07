import React from 'react';
import { NavLink } from 'react-router-dom';
import './IntoToCreateSpot.css'

function IntoToCreateSpot(props) {
    return (
        <div className='whole-page-123'> 
            <div className='letters-words-3774'>
                <h1>It’s easy to get 
                    started on IDbnb</h1>
                <div className='the-three-list-29384'>
                    <div className='one-list-2884'>
                        <h2>1</h2>
                        <div className='words-28383ndd'>
                            <h2>Tell us about your place</h2>
                            <h3>Share some basic info, like where it is and how many guests can stay.</h3>
                        </div>
                        <img src='https://a0.muscache.com/4ea/air/v2/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg' alt='img 1'/>
                    </div>
                    <div className='two-list-28384'>
                        <h2>2</h2>
                        <div className='words-28nfjjf'>
                            <h2>Make it stand out</h2>
                            <h3>Add 5 or more photos plus a title and description—we’ll help you out.</h3>
                        </div>
                        <img src='https://a0.muscache.com/4ea/air/v2/pictures/bfc0bc89-58cb-4525-a26e-7b23b750ee00.jpg' alt='img 2' />
                    </div>
                    <div className='three-list-2884'>
                        <h2>3</h2>
                        <div className='word-jbjbwe2292'>
                            <h2>Finish up and publish</h2>
                            <h3>Choose if you'd like to start with an experienced guest, set a starting price, and publish your listing.</h3>
                        </div>    
                        <img src='https://a0.muscache.com/4ea/air/v2/pictures/c0634c73-9109-4710-8968-3e927df1191c.jpg' alt='img 3' />
                    </div>
                </div>
            </div>
            <div className='the-form-button-28833'>
                    <NavLink className='link-to-form-2i332' to='/spots/new'>
                        <button type='button' >Get Started</button>
                    </NavLink>
                </div>
        </div>
       
    );
}

export default IntoToCreateSpot;