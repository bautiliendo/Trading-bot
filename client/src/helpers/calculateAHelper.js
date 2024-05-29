// Lógica para encontrar A (puntaCompradorat1 / puntaVendedoraT0 - 1) x 100
export const calculateAHelper = (sortedT0Data, sortedt1Data ) => {

    return sortedT0Data
      .map((t0Ticker, index) => {
        const t1Ticker = sortedt1Data[index];
        if (
          t0Ticker.dataT0 &&
          t1Ticker.datat1 &&
          t0Ticker.dataT0.puntas.length > 0 &&
          t1Ticker.datat1.puntas.length > 0
        ) {
          // Obtener la primera punta vendedora en T0
          const puntaVendedoraT0 = t0Ticker.dataT0.puntas[0].precioVenta;

          // Obtener la primera punta compradora en t1
          const puntaCompradorat1 = t1Ticker.datat1.puntas[0].precioCompra;

          // Calcular A
          const a = (puntaCompradorat1 / puntaVendedoraT0 - 1) * 100;
          return {
            simbolo: t0Ticker.simbolo,
            a,
            puntaVendedoraT0,
            puntaCompradorat1,
          };
        }
        return null;
      })
      .filter(Boolean);
  };