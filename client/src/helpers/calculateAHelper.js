// Lógica para encontrar A (puntaCompradoraT2 / puntaVendedoraT0 - 1) x 100
export const calculateAHelper = (sortedT0Data, sortedT2Data ) => {

    return sortedT0Data
      .map((t0Ticker, index) => {
        const t2Ticker = sortedT2Data[index];
        if (
          t0Ticker.dataT0 &&
          t2Ticker.dataT2 &&
          t0Ticker.dataT0.puntas.length > 0 &&
          t2Ticker.dataT2.puntas.length > 0
        ) {
          // Obtener la primera punta vendedora en T0
          const puntaVendedoraT0 = t0Ticker.dataT0.puntas[0].precioVenta;

          // Obtener la primera punta compradora en T2
          const puntaCompradoraT2 = t2Ticker.dataT2.puntas[0].precioCompra;

          // Calcular A
          const a = (puntaCompradoraT2 / puntaVendedoraT0 - 1) * 100;
          return {
            simbolo: t0Ticker.simbolo,
            a,
            puntaVendedoraT0,
            puntaCompradoraT2,
          };
        }
        return null;
      })
      .filter(Boolean);
  };