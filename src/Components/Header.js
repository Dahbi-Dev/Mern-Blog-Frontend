import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';

export default function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);

    
    useEffect(() => {
        fetch('http://localhost:3001/profile', {
            credentials: 'include',
        }).then((response) => {
            response.json().then((userInfo) => {
                setUserInfo(userInfo);
            });
        });
    }, [setUserInfo]);

    function logout() {
        fetch('http://localhost:3001/logout', {
            credentials: 'include',
            method: 'post',
        }).then(() => {
            // Handle success, e.g., redirect to the login page
            setUserInfo(null);
        });
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className="Logo">
                BlogStack
            </Link>
            <nav>
                {username && (
                    <>
                        {username === 'Houssam' && (
                            <Link className="create-btn" to="/create">
                                Create new post
                            </Link>
                        )}
                        <Link className="logout logout-btn" href="#" onClick={logout}>
                            Logout
                        </Link>
                    </>
                )}
                {!username && (
                    <>
                        <Link className='btn' to="/login">Login</Link>
                        <Link className='btn' to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
