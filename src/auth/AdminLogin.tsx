import React from 'react';
import { useAuth0 } from "./react-auth0-spa";
import Button from '@material-ui/core/Button';

const AdminLogin = () => {

    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        <div>
            <div>
                Login
            </div>
            <div>
                {!isAuthenticated && (
                    <Button
                        onClick={loginWithRedirect}
                    >
                        Log In
                    </Button>
                )}
            </div>
        </div>
    );  
}

export default AdminLogin;
