export const trimHash = (hash: string, length: number = 15) => {
    if (hash.length <= length) {
      return hash;
    }
    return `${hash.substring(0, length)}...`;
  };