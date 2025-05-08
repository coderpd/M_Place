/** @type {import('next').NextConfig} */
const nextConfig = {
    // Force a unique build ID on each deployment
    generateBuildId: async () => {
      return Date.now().toString();
    },
  
    // Modify Webpack config to help with proper chunk naming and caching
    webpack(config) {
      config.output.filename = 'static/chunks/[name].[contenthash].js';
      config.output.chunkFilename = 'static/chunks/[name].[contenthash].js';
      return config;
    },
  };
  
  export default nextConfig;