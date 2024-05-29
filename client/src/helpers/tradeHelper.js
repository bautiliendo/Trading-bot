import { toast } from "react-hot-toast";

export const executeTrade = async (
  accessToken,
  tickersData,
  setT0,
  sett1,
  setCaucionPesos,
  setCaucionDolares,
  setIsDataReady,
  navigate
) => {
  if (accessToken) {
    try {
      const promises = tickersData.map(async (ticker) => {
        const { mercado, simbolo, plazo } = ticker;
        const urlt1 = `http://localhost:3001/auth/trade?accessToken=${accessToken}&mercado=${mercado}&simbolo=${simbolo}&plazo=${plazo[1]}`;
        const responset1 = await fetch(urlt1, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!responset1.ok) {
          throw new Error("Error en el trade t1");
        } else {
          const datat1 = await responset1.json();
          const newObjt1 = {
            mercado,
            simbolo,
            datat1,
          };
          sett1((prevt1) => [...prevt1, newObjt1]);
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
          //Verifica que la caucion en dolares sea correcta ( generalmente < 10)
          if (dataCaucion.titulos[1].tasaPromedio < 10) {
            setCaucionDolares(dataCaucion.titulos[1].tasaPromedio);
          } else if (dataCaucion.titulos[0].tasaPromedio < 10) {
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
