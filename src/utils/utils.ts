export const isFinite = (a: number | null | undefined) => {
  return !(a === null || a === undefined);
};

export const insertString = (targetString: string, position: number, stringToInsert: string) => {
  return (
    targetString.substring(0, position) +
    stringToInsert +
    targetString.substring(position, targetString.length)
  );
};

export const deleteKeyFromMap = (map: Map<string, any>, key: string) => {
  map.delete(key);
  return map;
};
