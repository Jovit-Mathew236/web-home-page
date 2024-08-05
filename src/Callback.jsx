import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = `${import.meta.env.VITE_BASE_URL}/callback`

function Callback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (code) {
            exchangeCodeForToken(code);
        }
    }, [location]);

    async function exchangeCodeForToken(code) {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                }),
            });

            const data = await response.json();
            console.log("Token response:", data);  // Add this line
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                navigate('/');
            } else {
                console.error("No access token received");
            }
        } catch (error) {
            console.error("Error exchanging code for token:", error);
        }
    }

    return <div>Loading...</div>;
}

export default Callback;