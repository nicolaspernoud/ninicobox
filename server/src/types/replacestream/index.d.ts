// Type definitions for replacestream 4.0.3
// Project: brackets-proxy
// Definitions by: Nicolas Pernoud (https://github.com/nicolaspernoud/brackets-proxy)

declare module 'replacestream' {
  interface ReplaceStreamOptions {
    limit?: number;
    encoding?: string;
    maxMatchLen?: number;
  }
  export = ReplaceStream;
  function ReplaceStream(
    search: RegExp | string,
    replace: (() => string) | string,
    options?: ReplaceStreamOptions
  ): any;
}
