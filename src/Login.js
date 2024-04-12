import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Login.css'
import './fonts/icomoon/style.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password,
            });
            if (response.data.message === 'success') {
                setMessage(response.data.message);
                // Redirect to the home page upon successful login
                navigate('/home');
            } else {
                alert('Login failedddd');
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

    return (
        <div class="d-lg-flex half">
            <div class="bg order-1 order-md-2" style={{
                backgroundImage: `url('/bg0.png')`,
            }}></div>
            <div class="contents order-2 order-md-1">
                <div class="col-md-7">
                    <h3>Login to <strong>FInvesté</strong></h3>
                    <p class="mb-4">Unlock Your Investment Potential with Our Advanced Stock Screener.</p>
                    <form onSubmit={handleLogin}>
                        <div class="form-group first">
                            <label for="username">Username</label>
                            <input type="email" class="form-control" placeholder="your-email@gmail.com" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required></input>
                        </div>

                        <div class="form-group last mb-3">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" placeholder="your password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                        </div>

                        <div class="d-flex mb-5 align-items-center" id='rememberDiv'>
                            <label class="control control--checkbox mb-0"><span class="caption">Remember me</span>
                                <input type="checkbox" checked="checked" name="remember_me" />
                                <div class="control__indicator"></div>
                            </label>
                            <span class="ml-auto"><a href="/reset" class="forgot-pass">Forgot Password</a></span>
                        </div>

                        {message && renderMessageDiv()}

                        <input type="submit" value="Log In" class="btn btn-block btn-primary" id='loginBtn'></input>

                        <div class="d-flex align-items-center" id="switch">
                            <span class="caption">Don't have an account?</span>
                            <span class="ml-auto"><a href="{{ url_for('signup')}}" class="switch-pass">Sign up here</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
