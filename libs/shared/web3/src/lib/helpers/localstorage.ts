export const loadState = (name: string) => {
  try {
    const serializedState = localStorage.getItem(name + "-state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (name: string, state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(name + "-state", serializedState);
  } catch {
    // ignore write errors
  }
};
