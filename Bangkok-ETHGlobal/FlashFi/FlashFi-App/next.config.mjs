/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
      config.resolve.fallback = { fs: false, net: false, tls: false };
      config.externals.push('pino-pretty', 'encoding');
      return config;
    },
    typescript: {
          // !! WARN !!
          // Dangerously allow production builds to successfully complete even if
          // your project has type errors.
          // !! WARN !!
          ignoreBuildErrors: true,
        },    
  };
export default nextConfig;
