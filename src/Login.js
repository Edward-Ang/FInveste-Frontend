import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './css/Login.css'
import './fonts/icomoon/style.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [checked, setChecked] = useState(true);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const checkRememberMeCookie = () => {
            const cookies = document.cookie.split(';');
            const rememberMeCookie = cookies.find(item => item.trim().startsWith('remember_me_client='));

            console.log(rememberMeCookie);
            if (rememberMeCookie) {
                navigate('/home');
            } else {
                console.log('The remember_me cookie is not set.');
            }
        };

        // Call the function to check for the cookie
        checkRememberMeCookie();
    }, []);

    axios.defaults.withCredentials = true;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://54.179.119.22:5000/api/login', {
                username,
                password,
                checked,
            });
            if (response.data.message === 'success') {
                setMessage(response.data.message);
                // Redirect to the home page upon successful login
                navigate('/home');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage(error);
        }
    };

    const renderSuccessDiv = () => (
        <div className="alert alert-success" role="alert">
            <span><i className="bi bi-check-circle-fill"></i>&nbsp;Login Successfully!</span>
        </div>
    );

    const renderOtherDiv = () => (
        <div className="alert alert-warning" role="alert">
            <span><i className="bi bi-info-circle-fill"></i>&nbsp;Invalid username/password.</span>
        </div>
    );

    // Determine which div to render based on the value of message
    const renderMessageDiv = () => {
        if (message === 'success') {
            return renderSuccessDiv();
        } else {
            return renderOtherDiv();
        }
    };

    const toggleChecked = (event) => {
        setChecked(event.target.checked);
    }

    return (
        <div className="d-lg-flex half">
            <div className="bg order-1 order-md-2" style={{
                backgroundImage: `url('/images/bg0.png')`,
            }}></div>
            <div className="contents order-2 order-md-1">
                <div className="col-md-7">
                    <h3>Login to <strong>FInvesté</strong></h3>
                    <p className="mb-4">Unlock Your Investment Potential with Our Advanced Stock Screener.</p>
                    <form onSubmit={handleLogin}>
                        <div className="form-group first">
                            <label htmlFor="username">Username</label>
                            <input type="email" className="form-control" placeholder="your-email@gmail.com" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required></input>
                        </div>

                        <div className="form-group last mb-3">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" placeholder="your password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                        </div>

                        <div className="d-flex mb-5 align-items-center" id='rememberDiv'>
                            <label className="control control--checkbox mb-0"><span className="caption">Remember me</span>
                                <input type="checkbox" checked={checked} onChange={toggleChecked} name="remember_me" />
                                <div className="control__indicator"></div>
                            </label>
                        </div>

                        {message && renderMessageDiv()}

                        <input type="submit" value="Log In" className="btn btn-block btn-primary" id='loginBtn'></input>

                        <div className="d-flex align-items-center" id="switch">
                            <span className="caption">Don't have an account?</span>
                            <span className="ml-auto"><Link to='/signup' className="switch-pass">Sign up here</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
