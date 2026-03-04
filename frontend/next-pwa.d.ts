declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    sw?: string;
    scope?: string;
    reloadOnOnline?: boolean;
    fallbacks?: {
      document?: string;
    };
    publicExcludes?: string[];
    buildExcludes?: string[];
    cacheOnFrontEndNav?: boolean;
    cacheStartUrl?: boolean;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  
  export default withPWA;
}
