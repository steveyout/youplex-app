const { withAppBuildGradle, withMainApplication } = require('@expo/config-plugins');

function withCasterSDK(config) {
    // Add JAR dependency to build.gradle
    config = withAppBuildGradle(config, (config) => {
        if (!config.modResults.contents.includes("implementation files('libs/castar.jar')")) {
            config.modResults.contents = config.modResults.contents.replace(
                /dependencies\s*{/,
                `dependencies {\n    // CasterSDK JAR\n    implementation files('libs/castar.jar')`
            );
        }
        return config;
    });

    // Add CasterSDK package to MainApplication
    config = withMainApplication(config, (config) => {
        let { contents } = config.modResults;

        // Add import if not present
        if (!contents.includes('import com.castersdk.CasterSDKPackage')) {
            contents = contents.replace(
                /(import\s+expo\.modules\.ReactNativeHostWrapper)/,
                '$1\nimport com.castersdk.CasterSDKPackage'
            );
        }

        // Add package if not present
        if (!contents.includes('add(CasterSDKPackage())')) {
            contents = contents.replace(
                /(\/\/\s*add\(MyReactNativePackage\(\)\))/,
                '$1\n              add(CasterSDKPackage())'
            );
        }

        config.modResults.contents = contents;
        return config;
    });

    return config;
}

module.exports = withCasterSDK;