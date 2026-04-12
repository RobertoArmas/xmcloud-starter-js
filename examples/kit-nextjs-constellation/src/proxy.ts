import { type NextRequest } from "next/server";
import {
  defineProxy,
  AppRouterMultisiteProxy,
  PersonalizeProxy,
  RedirectsProxy,
  LocaleProxy,
} from "@sitecore-content-sdk/nextjs/proxy";
import sites from ".sitecore/sites.json";
import virtualFolders from ".sitecore/virtual-folders.json";
import scConfig from "sitecore.config";
import c4sConfig from "constellation4sitecore.config";
import { routing } from "./i18n/routing";
import { VirtualFolderProxy } from "@constellation4sitecore-content-sdk/nextjs/proxy";
import { CSPProxy } from "@constellation4sitecore-content-sdk/security/proxy";

const locale = new LocaleProxy({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  /**
   * List of all supported locales configured in routing.ts
   */
  locales: routing.locales.slice(),
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  // in multilanguage scenarios, we need locale middleware to always run first to ensure locale is set and used correctly by the rest of the middlewares
  skip: () => false,
});

const multisite = new AppRouterMultisiteProxy({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  ...scConfig.multisite,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => false,
});

const redirects = new RedirectsProxy({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  ...scConfig.api.local,
  ...scConfig.redirects,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  // By default it is disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => false,
});

const personalize = new PersonalizeProxy({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  ...scConfig.personalize,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  // By default it is disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => false,
});

const virtualFolder = new VirtualFolderProxy({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  virtualFolders,
  c4sConfig,
});

const csp = new CSPProxy({
  sites,
  ...scConfig.api.edge,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  // By default it is disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => process.env.NODE_ENV === "development",
});

export default function proxy(req: NextRequest) {
  return defineProxy(
    locale,
    multisite,
    virtualFolder,
    redirects,
    personalize,
    csp
  ).exec(req);
}

export const config = {
  /*
   * Match all paths except for:
   * 1. API route handlers
   * 2. /_next (Next.js internals)
   * 3. /sitecore/api (Sitecore API routes)
   * 4. /- (Sitecore media)
   * 5. /healthz (Health check)
   * 7. all root files inside /public
   */
  matcher: [
    "/",
    "/((?!api/|\\.well-known/|sitemap|robots|llms|_next/|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg|ai/).*)",
  ],
};
