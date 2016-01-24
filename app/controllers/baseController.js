var getAssetPath = require('../../config/assetsPipelineEnvironment').getAssetPath;

module.exports = {
    baseContext: {
        asset_path: getAssetPath
    }
}