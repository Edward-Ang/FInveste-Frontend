import React from "react";

function Reset() {

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-4 col-md-offset-4">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="text-center">
                                    <h1><i className="fa-solid fa-lock fa-2x"></i></h1>
                                    <h2 className="text-center">Forgot Password?</h2>
                                    <p>You can reset your password here.</p>
                                    <div className="panel-body">

                                        <form id="register-form" autoComplete="off" className="form" action="/reset_password" method="post">

                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                                    <input id="email" name="email" placeholder="email address" className="form-control" type="email" required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Get Reset Link" type="submit" />
                                            </div>

                                            <input type="hidden" className="hide" name="token" id="token" value="" />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reset;