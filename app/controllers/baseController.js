var     getassetPath = require('../../config/assetsPipelineEnvironment').getAssetPath;

module.exports = {
    baseContext: {
        asset_path: getassetPath
    }
}