import { toast } from "react-hot-toast";

export const executeTrade = async (
  accessToken,
  tickersData,
  setT0,
  setT2,
  setCaucionPesos,
  setCaucionDolares,
  setIsDataReady,
  navigate
) => {
  if (accessToken) {
    try {
      const promises = tickersData.map(async (ticker) => {
        const { mercado, simbolo, plazo } = ticker;
        const urlT2 = `http://localhost:3001/auth/trade?accessToken=${accessToken}&mercado=${mercado}&simbolo=${simbolo}&plazo=${plazo[1]}`;
        const responseT2 = await fetch(urlT2, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!responseT2.ok) {
          throw new Error("Error en el trade t2");
        } else {
          const dataT2 = await responseT2.json();
          const newObjT2 = {
            mercado,
            simbolo,
            dataT2,
          };
          setT2((prevT2) => [...prevT2, newObjT2]);
        }
      });

      await Promise.all(promises);

      // Fetch t0 data for each ticker
      const t0Promises = tickersData.map(async (ticker) => {
        const { mercado, simbolo, plazo } = ticker;
        const urlT0 = `http://localhost:3001/auth/trade?accessToken=${accessToken}&mercado=${mercado}&simbolo=${simbolo}&plazo=${plazo[0]}`;
        const responseT0 = await fetch(urlT0, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!responseT0.ok) {
          throw new Error("Error en el trade T0");
        } else {
          const dataT0 = await responseT0.json();
          const newObjtT0 = {
            mercado,
            simbolo,
            dataT0,
          };
          setT0((prevT0) => [...prevT0, newObjtT0]);
        }
      });

      await Promise.all(t0Promises);

      const caucionPromise = async () => {
        const urlCaucion = `http://localhost:3001/auth/caucion?accessToken=${accessToken}`;
        const responseCaucion = await fetch(urlCaucion, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!responseCaucion.ok) {
          throw new Error("Error en la obtencion de la caucion");
        } else {
          const dataCaucion = await responseCaucion.json();
          console.log(dataCaucion);
          //Verifica que la caucion en pesos sea correcta (> 20)
          if (dataCaucion.titulos[0].tasaPromedio > 20) {
            setCaucionPesos(dataCaucion.titulos[0].tasaPromedio);
          } else if (dataCaucion.titulos[1].tasaPromedio > 20) {
            setCaucionPesos(dataCaucion.titulos[1].tasaPromedio);
          } else {
            throw new Error("Error en la obtencion de la caucion en pesos");
          }
          //Verifica que la caucion en dolares sea correcta ( generalmente < 5)
          if (dataCaucion.titulos[1].tasaPromedio < 5) {
            setCaucionDolares(dataCaucion.titulos[1].tasaPromedio);
          } else if (dataCaucion.titulos[0].tasaPromedio < 5) {
            setCaucionDolares(dataCaucion.titulos[0].tasaPromedio);
          } else {
            throw new Error("Error en la obtencion de la caución en dolares");
          }
        }
      };

      await Promise.all([caucionPromise()]);
      toast.success("Ya puedes acceder a los datos");
      setIsDataReady(true);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  } else {
    toast.error("Acces token expirado");
    navigate("/");
  }
};
