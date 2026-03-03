// Sum array of numbers
export function sumNumArray(arr: number[]): number {
  return arr.reduce((part, n) => part + n, 0);
}
export function csvToNumArray(str: string): number[] {
  return str.split(',').map((n: string) => parseInt(n));
}