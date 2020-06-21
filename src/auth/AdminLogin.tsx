import React from 'react';
import { useAuth0 } from "./react-auth0-spa";
import Button from '@material-ui/core/Button';


const AdminLogin = () => {

    const { loading, loginWithPopup, isAuthenticated } = useAuth0();

    if (loading) {
        return <div></div>
    };

    return (
        <div>
            <div>
                Login
            </div>
            <div>
                {!isAuthenticated && (
                    <Button
                        onClick={() => loginWithPopup({})}
                    >
                        Log In
                    </Button>
                )}
            </div>
        </div>
    );  
}

export default AdminLogin;
