const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { zodToJsonSchema } = require('zod-to-json-schema');

const getFnSchema = (fn) => fn?.customFunction ?? {};
const toToolDefinition = ({ toolName, inputSchema, outputSchema, description }) => ({
    name: toolName,
    description: description  || `Tool for ${toolName}`,
    inputSchema: zodToJsonSchema(inputSchema),
    outputSchema: zodToJsonSchema(outputSchema),
});

module.exports = function(grunt) {

    grunt.registerTask('generate-tool-schema', 'Generate tool schemas from function definitions', function() {
        grunt.log.ok('Generating tool schemas...');
        const rootDir = process.cwd();
        const scriptCache = {};

        const loadBundledModule = (virtualPath) => {
            if (!scriptCache[virtualPath]) {
                scriptCache[virtualPath] = require(path.join(rootDir, 'assets', virtualPath));
            }
            return scriptCache[virtualPath];
        };

        const getFnDefinitions = () => {
            const functionsPath = path.join(rootDir, 'assets', 'functions.json');
            const { exports: tools } = JSON.parse(fs.readFileSync(functionsPath, 'utf8'));
            return tools.map(({ id: toolName, virtualPath }) => {
                grunt.log.ok(`Loading tool: ${toolName} from ${virtualPath}`);
                const module = loadBundledModule(virtualPath);
                const fn = module?.[toolName];
                if (!fn) {
                    grunt.log.warn(`Module or function ${toolName} not found at ${virtualPath}`);
                    return null;
                }
                const { inputSchema, outputSchema, description } = getFnSchema(fn);
                if( !inputSchema || !outputSchema) {
                    grunt.log.debug(`Function ${toolName} does not have inputSchema or outputSchema defined.skipping.`);
                    return null;
                }
                return { toolName, inputSchema, outputSchema, description };
            }).filter(Boolean);
        };

        const tools = getFnDefinitions().map(toToolDefinition);
        grunt.file.write('./assets/tools.schema.yaml', yaml.dump({ tools }));
        grunt.log.ok('Wrote ' + tools.length + ' tool schemas to ./assets/tools.schema.yaml');
    })
}