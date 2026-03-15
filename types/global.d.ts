declare module 'multer' {
  import type { Request } from 'express';
  const multer: any;
  export default multer;
}

declare module 'http-proxy-middleware' {
  export function createProxyMiddleware(...args: any[]): any;
  const _default: any;
  export default _default;
}

declare global {
  namespace Express {
    // Minimal Multer File and Request typings used in this repo until @types/multer is installed
    interface Multer {
      File: any;
    }

    interface Request {
      file?: any;
    }
  }
}

export {};
