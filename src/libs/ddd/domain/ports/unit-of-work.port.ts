export interface IUnitOfWorkPort {
  execute<T>(
    correlationId: string,
    callback: () => Promise<T>,
    options?: unknown,
  ): Promise<T>;
}
