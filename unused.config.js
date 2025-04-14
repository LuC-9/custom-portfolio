module.exports = {
  // Root directory (can be relative or absolute)
  directory: '.',
  
  // Glob patterns to include when scanning
  include: [
    'components/**',
    'lib/**',
    'pages/**',
    'app/**',
    'styles/**',
    'utils/**'
  ],
  
  // Glob patterns to exclude when scanning
  exclude: [
    'node_modules/**',
    '.next/**',
    'public/**',
    '**/*.d.ts',
    '**/*.test.*',
    '**/*.spec.*'
  ],
  
  // Extensions to scan
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
  
  // Files that are always considered "used"
  // Add your entry points and special files here
  entrypoints: [
    'pages/_app.tsx',
    'pages/_document.tsx',
    'app/layout.tsx',
    'next.config.mjs'
  ],
  
  // Custom patterns to consider when determining if a file is used
  // This helps with dynamic imports and other non-standard import patterns
  customPatterns: [
    {
      name: 'NextJS Dynamic Import',
      regex: /dynamic\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    },
    {
      name: 'React.lazy',
      regex: /React\.lazy\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    }
  ]
};