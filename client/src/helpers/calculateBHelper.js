export const calculateBValueHelper = (caucion) => {
    const day = new Date().getDay()

    switch (day) {
      case 0: //domingo
      case 6: //sabado
        return 0;
      case 1: // lunes
      case 2: // m
      case 3: // m
      case 4: // j
        return (caucion / 365);
      case 5: // v
        return (caucion / 365) * 3;
      default:
        return 0;
    }
  };