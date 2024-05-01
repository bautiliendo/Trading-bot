Algoritmo que le facilita y logra identificar oportunidades para hacer trading de activos realizando peticiones a la API de invertironline.com.
Frontend: React JS.
Backend: Node JS + Express
Diversos tickers de acciones son procesados y se compara A con B. ( Puedes ingresar tickers manualmente ) Ej ticker : AL30
El algoritmo compara: 
A = Precio 48hs(t2) / Precio contado inmediato (t0)
B = Tasa caución TNA / 365 de lunes a miércoles.
Este código debera ser actualizado en junio debido a la quita del plazo 48 hs (t2) 
