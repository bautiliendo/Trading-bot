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
    const accessToken = req.headers.authorization;
    const mercado = req.query.mercado;
    const simbolo = req.query.simbolo;
    const plazo = req.query.plazo || t0 //Mejorar esta logica, para que se hagan 2 peticiones (t0 y t2)
    try { //Arreglar tema de model.mercado y model.simbolo(ALUA)
        const response = await fetch(`https://api.invertironline.com/api/v2/${mercado}/Titulos/${simbolo}/Cotizacion?mercado=${mercado}&simbolo=${simbolo}&model.simbolo=ALUA&model.mercado=${mercado}&model.plazo=${plazo}`,
         {
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
