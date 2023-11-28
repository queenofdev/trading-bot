export class LocalStorage {
  public static set(key: string, val: any) {
    const prepared = JSON.stringify([val]);
    localStorage.setItem(key, prepared);
  }

  public static get<T = any>(key: string, defaultValue = null): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data)[0] : defaultValue;
  }

  public static has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  public static remove(key: string) {
    return localStorage.removeItem(key);
  }

  public static clearAll() {
    localStorage.clear();
  }
}
