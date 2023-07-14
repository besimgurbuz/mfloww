/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockLocalStorage implements Storage {
  length = 0;

  clear(): void {
    return;
  }
  getItem(key: string): string | null {
    return null;
  }
  key(index: number): string | null {
    return null;
  }
  removeItem(key: string): void {
    return;
  }
  setItem(key: string, value: string): void {
    return;
  }
}
