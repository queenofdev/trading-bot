export class DebugHelper {
  private static permissions = ["enable-testnet", "disable-multicall", "enable-tracing"];
  private static active = DebugHelper.permissions.reduce(
    (active: { [key: string]: boolean }, permission: string) => {
      // Check if enabled via url
      // eslint-disable-next-line no-restricted-globals
      const enabled = ~location.href.indexOf(permission)
        ? ~window.location.href.indexOf(permission + "=false")
          ? false
          : true
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
