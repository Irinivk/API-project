import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useEffect } from "react";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        const err = {}

        if (credential.length < 4) err.credential = ''
        if (password.length < 6) err.password = ''

        setErrors(err)
    }, [credential, password])


    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const DemoUser = (e) => {
        e.preventDefault();
        return dispatch(sessionActions.login({ credential: "newDemoUser@gmail.com", password: "password" }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    return (
        <div className="loginForm">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit} className='loginUserForm'>
                
                <label>
                    Email
                    <input
                        type="text"
                        id="logininput"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        id='logininput'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && (
                    <p>{errors.credential}</p>
                )}
                <button type="submit"
                disabled={Boolean(Object.values(errors).length)}
                >Log In</button>
                <button className="demo-user" onClick={(e) => DemoUser(e)}>
                    Demo User
                </button>
            </form>
        </div>
    );
}

export default LoginFormModal;