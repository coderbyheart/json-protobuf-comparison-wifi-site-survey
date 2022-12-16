export const formatMac = (hex) =>
  hex
    .split("")
    .reduce((formatted, s, i) => {
      if (i % 2 === 0) formatted.push([]);
      formatted[formatted.length - 1].push(s);
      return formatted;
    }, [])
    .map((f) => f.join(""))
    .join(":");
