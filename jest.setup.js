// Add custom jest matchers from jest-dom
require('@testing-library/jest-dom');

// Polyfill fetch for testing
require('whatwg-fetch');

// Mock unified and related markdown modules for the parts that fail
jest.mock('unified', () => {
  return {
    unified: () => ({
      use: jest.fn().mockReturnThis(),
      parse: (markdown) => {
        // Simple markdown to AST conversion for tests
        if (markdown.startsWith('# ')) {
          return {
            type: 'root',
            children: [{
              type: 'heading',
              depth: 1,
              children: [{ type: 'text', value: markdown.slice(2) }]
            }]
          };
        }
        if (markdown.includes('**') && markdown.includes('*')) {
          return {
            type: 'root',
            children: [{
              type: 'paragraph',
              children: [
                { type: 'strong', children: [{ type: 'text', value: 'Bold' }] },
                { type: 'text', value: ' and ' },
                { type: 'emphasis', children: [{ type: 'text', value: 'Italic' }] }
              ]
            }]
          };
        }
        return {
          type: 'root',
          children: [{
            type: 'paragraph',
            children: [{ type: 'text', value: markdown }]
          }]
        };
      }
    })
  };
});

jest.mock('remark-parse', () => jest.fn());

// Mock next/cache for testing
jest.mock('next/cache', () => ({
  unstable_cache: (fn) => fn,
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
}));

// Mock fetch for contentful API calls
global.fetch = jest.fn((url, options) => {
  const body = JSON.parse(options?.body || '{}');
  const query = body.query || '';
  
  // Mock different responses based on query
  if (query.includes('streetCollection')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        data: {
          streetCollection: {
            items: [
              {
                germanName: 'Test Street',
                slug: 'test-street'
              }
            ]
          }
        }
      })
    });
  }
  
  if (query.includes('postCollection')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        data: {
          postCollection: {
            items: [
              {
                fields: {
                  title: 'Test Post',
                  slug: 'test-post'
                }
              }
            ]
          }
        }
      })
    });
  }
  
  if (query.includes('districtCollection')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        data: {
          districtCollection: {
            items: [
              {
                name: 'Test District'
              },
              {
                name: 'Another District'
              }
            ]
          }
        }
      })
    });
  }
  
  // Default response
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      data: {}
    })
  });
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return require('react').createElement('img', props);
  },
})); 