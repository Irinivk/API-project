import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
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
            <button onClick={openMenu}>
                <div className="menuIcon">
                    <i className="fa-solid fa-bars" />
                </div>
                <div className="userIcon">
                    <i className="fas fa-user-circle" />
                </div>
            </button>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className="userInfo">
                        <li>{user.username}</li>
                        <li>{user.firstName} {user.lastName}</li>
                        <li>{user.email}</li>
                        <div>
                            {sessionUser ?
                                <NavLink
                                    className='manage-the-spot'
                                    to='/spots/current'
                                >Manage Spots</NavLink>
                                : null}
                        </div>
                        <li>
                            <button onClick={logout}>Log Out</button>
                        </li>
                    
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
