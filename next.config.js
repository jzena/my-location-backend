const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest.json$/],
  disable:process.env.NODE_ENV === 'development',
  sw: 'service-worker.js'
});
/** @type {import('next').NextConfig} */

module.exports = withPWA({
  pwa: {
    dest: 'public'
  },
});