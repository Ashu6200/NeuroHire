const { pathToRegexp } = require('path-to-regexp');

try {
  const path = '/api/auth/*splat';
  const regexp = pathToRegexp(path);
  console.log('Regex for *splat:', regexp);
} catch (e) {
  console.error('Error for *splat:', e.message);
}

try {
  const path = '/api/auth/:splat*';
  const regexp = pathToRegexp(path);
  console.log('Regex for :splat*:', regexp);
} catch (e) {
  console.error('Error for :splat*:', e.message);
}

try {
  const path = '/api/auth/(.*)';
  const regexp = pathToRegexp(path);
  console.log('Regex for (.*):', regexp);
} catch (e) {
  console.error('Error for (.*):', e.message);
}
