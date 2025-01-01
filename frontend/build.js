import { build } from '@react-router/dev';

await build({
    rootDirectory: process.cwd(),
    serverBundles: false 
});