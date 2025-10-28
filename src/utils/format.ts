export function formatDoc<T extends { _id: any; __v?: number }>(doc: T) {
  const { _id, __v, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest
  };
}