Algoritmo que le facilita y logra identificar oportunidades para hacer trading de activos realizando peticiones a la API de invertironline.com.
Frontend: React JS.
Backend: Node JS + Express
Diversos tickers de acciones son procesados y se compara A con B. ( Puedes ingresar tickers manualmente ) Ej ticker : AL30
El algoritmo compara: 
A = Precio 48hs(t2) / Precio contado inmediato (t0)
B = Tasa caución TNA / 365 de lunes a miércoles (x2) jueves (x4) viernes (x3)
Este código debera ser actualizado el 28 mayo debido a la quita del plazo 48 hs (t2) 

COMO EJECUTAR:
1) En una carpeta vacia , abrir terminal y hacer un git clone https://github.com/bautiliendo/Trading-bot.git
2) cd client 
3) npm i 
4) cd ..
5) cd server
6) npm i 
7) Dentro del arrancarAppTemplate añadir ruta donde se encuentra la carpeta
Ej: "cd F:\Usuario\Desktop\bot\client && npm start"
8) Entrar a la carpeta que creaste y abrir arrancarAppTemplate

