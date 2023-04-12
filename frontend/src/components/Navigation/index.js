import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <ul>
            <li>
                <NavLink exact to="/">Home</NavLink>
            </li>
            <div className='nav-bar-right'>
                {sessionUser ? // only render the 'Create a New Spot' if there is a current user
                    <NavLink
                        className='create-new-spot'
                        to="/spots/new"
                    >Create a New Spot</NavLink>
                    : null}
            </div>
            {isLoaded && (
                <li>
                    <ProfileButton user={sessionUser} />
                </li>
            )}
        </ul>
    );
}

export default Navigation;