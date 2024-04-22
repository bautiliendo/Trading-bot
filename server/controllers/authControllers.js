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
};

export async function trade (req, res) {
    
    const { accessToken, mercado, simbolo, plazo } = req.query;

    try {
        const response = await fetch(`https://api.invertironline.com/api/v2/{Mercado}/Titulos/{Simbolo}/Cotizacion?mercado=${mercado}&simbolo=${simbolo}&model.simbolo=ALUA&model.mercado=bCBA&model.plazo=${plazo}&api_key=${accessToken}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
         }
        });

        const data = await response.json();
        res.json(data);  //Manejar la data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
