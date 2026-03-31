export {};

declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
      identify: (
        userId: string | null,
        traits?: Record<string, unknown>
      ) => void;
      page: (name?: string, properties?: Record<string, unknown>) => void;
    };
  }
}
