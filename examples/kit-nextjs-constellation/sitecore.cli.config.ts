import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateSites,
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';
import { generateVirtualFolders } from "@constellation4sitecore-content-sdk/nextjs/tools";
import scConfig from './sitecore.config';
import c4sConfig from './constellation4sitecore.config';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      generateMetadata(),
      generateSites(),
      generateVirtualFolders({ c4sConfig }),
      extractFiles(),
      writeImportMap({
        paths: ['src/components'],
      }),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    exclude: ['src/components/content-sdk/*'],
  },
});
