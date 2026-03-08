export async function api<T>(factory: () => Promise<T>) {
  return factory();
}
