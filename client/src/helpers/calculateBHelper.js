export const calculateBValueHelper = (caucion) => {
    const day = new Date().getDay()

    switch (day) {
      case 0:
      case 6:
        return 0;
      case 1:
      case 2:
      case 3:
        return (caucion / 365) * 2;
      case 4:
        return (caucion / 365) * 4;
      case 5:
        return (caucion / 365) * 4;
      default:
        return 0;
    }
  };