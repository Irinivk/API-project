import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import './ProfileButton.css'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory()

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        history.push('/')
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div className="userButton">  
            <button className="dropbtn">
                <div className="menuIcon">
                    <FontAwesomeIcon icon={faBars} size="xl" style={{ color: "#212121", }} className='the-icon' />
                </div>
                <div className="userIcon">
                    <i className="fas fa-user-circle" />
                </div>
            </button>
            <div className="dropdown-content" ref={ulRef}>
                {user ? (
                    <div className="userInfo">
                        <li>Hello, {user.firstName}</li>
                        <li>{user.email}</li>
                        {/* <li>{user.username}</li> */}
                        <div>
                            {sessionUser ?
                                <NavLink
                                    className='manage-the-spot'
                                    to='/spots/current'
                                >Manage Spots</NavLink>
                                : null}
                        </div>
                        <div className="logout-button-home">
                            <button onClick={logout}>Log Out</button>
                        </div>
                    
                    </div>
                ) : (
                    <div className="logIn">
                        <OpenModalMenuItem
                            itemText="Log In"
                            onItemClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;
