import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='top-bar'>
            <div className='home-button'>
                <NavLink exact to="/">
                    <img className="logo" src='https://www.svgrepo.com/show/36745/airbnb.svg' />
                    <h1>IDbnb</h1>
                </NavLink>
            </div>
            <div className='nav-bar-right'>
                {sessionUser ? // only render the 'Create a New Spot' if there is a current user
                    <NavLink
                        className='create-new-spot'
                        to="/spots/new"
                    >Create a New Spot</NavLink>
                    : null}
            </div>
            {isLoaded && (
                <div className='profile-button'>
                    <ProfileButton user={sessionUser} />
                </div>
        
            )}
        </div>
    );
}

export default Navigation;