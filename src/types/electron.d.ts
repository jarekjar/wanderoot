export {};

declare global {
  interface Window {
    electron: {
      getAssetPath: (assetPath: string) => string;
    };
  }
} 