import fetch from 'node-fetch';

export async function login (req, res) {
    const { username, password } = req.body;

    try {
        const response = await fetch('https://api.invertironline.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&grant_type=password`
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export async function datos (req, res) {
    
}
