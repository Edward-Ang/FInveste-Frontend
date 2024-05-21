import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './css/Login.css'
import './fonts/icomoon/style.css'

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                username,
                password,
            });
            if (response.data.message === 'User created successfully') {
                setMessage(response.data.message);
                // Redirect to the home page upon successful login
                navigate('/login');
            } else {
                alert('Signup failedddd');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert(error);
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
        <div className="d-lg-flex half">
            <div className="bg order-1 order-md-2" style={{
                backgroundImage: `url('/images/bg1.png')`,
            }}></div>
            <div className="contents order-2 order-md-1">
                <div className="col-md-7">
                    <h3>Sign up for <strong>FInvesté</strong></h3>
                    <p className="mb-4">Unlock Your Investment Potential with Our Advanced Stock Screener.</p>
                    <form id="registerForm" onSubmit={handleSignup}>
                        <div className="form-group first">
                            <label htmlFor="username">Username</label>
                            <input type="email" className="form-control" placeholder="your-email@gmail.com" id="username" name="username" onChange={(e) => setUsername(e.target.value)} required></input>
                        </div>
                        <div className="form-group last mb-3">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" placeholder="your password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required></input>
                        </div>

                        <div className="d-flex mb-5 align-items-center">
                            <label className="control control--checkbox mb-0"><span className="caption"></span>
                            </label>
                        </div>

                        {message && renderMessageDiv()}
   
                        <input type="submit" value="Sign Up" className="btn btn-block btn-primary" id='signupBtn'></input>

                            <div className="d-flex align-items-center" id="switch">
                                <span className="caption">Already have an account?</span>
                                <span className="ml-auto"><Link to='/login' className="switch-pass">Login here</Link></span>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
