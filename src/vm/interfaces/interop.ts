export interface Interop {
  toArray(): Buffer;
}

export function isInterop(item: any): item is Interop {
  return item.toArray !== undefined;
}
