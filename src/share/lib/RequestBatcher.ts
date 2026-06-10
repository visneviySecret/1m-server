type Waiter<TResult> = {
  resolve: (value: TResult) => void;
  reject: (reason: unknown) => void;
};

type QueueEntry<TPayload, TResult> = {
  payload: TPayload;
  waiters: Waiter<TResult>[];
};

export class RequestBatcher<TPayload, TResult> {
  private queue = new Map<string, QueueEntry<TPayload, TResult>>();
  private flushing = false;

  constructor(
    private readonly intervalMs: number,
    private readonly getKey: (payload: TPayload) => string,
    private readonly processBatch: (
      payloads: TPayload[]
    ) => Promise<Map<string, TResult>>
  ) {
    setInterval(() => {
      this.flush();
    }, intervalMs);
  }

  run(payload: TPayload): Promise<TResult> {
    const key = this.getKey(payload);

    return new Promise((resolve, reject) => {
      const existing = this.queue.get(key);

      if (existing) {
        existing.payload = payload;
        existing.waiters.push({ resolve, reject });
        return;
      }

      this.queue.set(key, {
        payload,
        waiters: [{ resolve, reject }],
      });
    });
  }

  private async flush() {
    if (this.queue.size === 0 || this.flushing) {
      return;
    }

    this.flushing = true;
    const batch = this.queue;
    this.queue = new Map();

    try {
      const payloads = [...batch.values()].map((entry) => entry.payload);
      const results = await this.processBatch(payloads);

      for (const [key, entry] of batch) {
        const result = results.get(key);

        if (result === undefined) {
          const error = new Error(`No batch result for key: ${key}`);
          entry.waiters.forEach((waiter) => waiter.reject(error));
          continue;
        }

        entry.waiters.forEach((waiter) => waiter.resolve(result));
      }
    } catch (error) {
      for (const entry of batch.values()) {
        entry.waiters.forEach((waiter) => waiter.reject(error));
      }
    } finally {
      this.flushing = false;
    }
  }
}
