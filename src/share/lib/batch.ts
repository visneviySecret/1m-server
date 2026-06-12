type Waiter = {
  resolve: () => void;
  reject: (reason: unknown) => void;
};

let pendingFactories: Array<() => Promise<void>> = [];
let pendingWaiters: Waiter[] = [];
let timer: NodeJS.Timeout | null = null;
const delay = 10_000;

export function batch(factory: () => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    pendingFactories.push(factory);
    pendingWaiters.push({ resolve, reject });

    if (!timer) {
      timer = setTimeout(async () => {
        const factories = pendingFactories;
        const waiters = pendingWaiters;
        pendingFactories = [];
        pendingWaiters = [];
        timer = null;

        try {
          await Promise.all(factories.map((f) => f()));
          waiters.forEach((waiter) => waiter.resolve());
        } catch (reason) {
          waiters.forEach((waiter) => waiter.reject(reason));
        }
      }, delay);
    }
  });
}
