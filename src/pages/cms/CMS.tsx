const CMS = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Content Management System</h1>
        <p className="text-gray-600">Manage website content, pages, and media</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pages Management */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Pages Management</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <h3 className="font-medium">Home Page</h3>
                <p className="text-sm text-gray-600">Main landing page</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Edit
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <h3 className="font-medium">About Us</h3>
                <p className="text-sm text-gray-600">Company information</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Edit
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <h3 className="font-medium">Contact</h3>
                <p className="text-sm text-gray-600">Contact information and form</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Blog Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Blog Posts</h2>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium text-sm">Latest Updates</h3>
              <p className="text-xs text-gray-600">5 posts</p>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create New Post
            </button>
          </div>
        </div>
        
        {/* Media Library */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Media Library</h2>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium text-sm">Images</h3>
              <p className="text-xs text-gray-600">124 files</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium text-sm">Videos</h3>
              <p className="text-xs text-gray-600">32 files</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium text-sm">Documents</h3>
              <p className="text-xs text-gray-600">18 files</p>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Upload Media
            </button>
          </div>
        </div>
        
        {/* SEO Settings */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                placeholder="Default meta title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                rows={3}
                placeholder="Default meta description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input
                type="text"
                placeholder="Comma separated keywords"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Banner Management */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Banner Management</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Home Banner</h3>
                <p className="text-sm text-gray-600">Main homepage banner</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Edit
                </button>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add New Banner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMS;
