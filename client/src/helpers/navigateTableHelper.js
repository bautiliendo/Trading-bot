import { toast } from "react-hot-toast";

export const navigateTable = (
  navigate,
  isDataReady,
  t0,
  t1,
  caucionPesos,
  caucionDolares
) => {
  if (isDataReady) {
    navigate("/table", {
      state: { t0Data: t0, t1Data: t1, caucionPesos, caucionDolares },
    });
  } else {
    toast.error("Los datos de tickers no estan cargados");
  }
};
