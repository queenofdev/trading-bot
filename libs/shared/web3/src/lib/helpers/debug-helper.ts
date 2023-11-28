import { isDev } from ".";

export class DebugHelper {
  private static permissions = [
    "enable-testnet",
    "disable-multicall",
    "enable-debug",
    "swap",
  ];
  private static active = DebugHelper.permissions.reduce(
    (active: { [key: string]: boolean }, permission: string) => {
      // Check if enabled via url
      const enabled = ~window.location.href.indexOf(permission)
        ? !~window.location.href.indexOf(permission + "=false")
        : null;
      // if declared, save config to session storage
      if (enabled !== null && window.sessionStorage)
        sessionStorage.setItem(permission, enabled ? "true" : "false");
      // Set active for permission if enabled or otherwise grab from session storage
      active[permission] =
        enabled ||
        (window.sessionStorage && sessionStorage.getItem(permission) === "true");
      return active;
    },
    {}
  );

  public static isActive(permission: string): boolean {
    return DebugHelper.active[permission] || false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
console.debug = DebugHelper.isActive("enable-debug") ? console.log : () => {};
