// Sum array of numbers
export function sumNumArray(arr: number[]): number {
  return arr.reduce((part, n) => part + n, 0);
}
export function csvToNumArray(str: string): number[] {
  return str.split(',').map((n: string) => parseInt(n));
}
export function getFormEntries(formElm: HTMLFormElement): string {
  const formData = new FormData(formElm);
  const ret: Record<string, any> = {};
  for (const [key, val] of formData.entries()) {
    if (key.endsWith("[]")) {
      const realKey = key.replace("[]", "");
      if (!ret[realKey]) {
        ret[realKey] = [];
      }
      ret[realKey].push(val);
    }
    else ret[key] = val;
  }
  return JSON.stringify(ret);
}