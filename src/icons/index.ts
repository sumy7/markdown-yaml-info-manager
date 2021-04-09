const req = require.context('./svg', false, /\.svg$/)
req.keys().map(req)
// const requireAll = (requireContext) => requireContext.keys().map(requireContext)
// requireAll(req)
