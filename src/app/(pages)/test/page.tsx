/**
 * Test Page - Example page demonstrating the route group pattern
 * 
 * This page will be accessible at: http://www.keith.com/test
 * (or http://localhost:3000/test in development)
 * 
 * Note: The (pages) folder is a "route group" - the parentheses
 * mean it doesn't add a segment to the URL path.
 */
export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="text-lg text-gray-600">
        This page is located at: <code>src/app/(pages)/test/page.tsx</code>
      </p>
      <p className="text-lg text-gray-600 mt-2">
        But it's accessible at the URL: <code>/test</code>
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="font-semibold mb-2">How It Works:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>The <code>(pages)</code> folder is a "route group"</li>
          <li>Route groups (folders in parentheses) don't add segments to the URL</li>
          <li>Pages inside are accessible at the root level</li>
          <li>This helps organize code without affecting URLs</li>
        </ul>
      </div>
    </div>
  );
}

