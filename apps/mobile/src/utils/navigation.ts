import { router } from 'expo-router';

export function goBackOrReplace(fallbackRoute: string) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallbackRoute as never);
}
