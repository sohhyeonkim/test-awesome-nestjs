export interface IEventEmitterPort {
  emit<T>(event: string, ...args: T[]): void;
}
