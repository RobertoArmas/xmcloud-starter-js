import { cacheLife, cacheTag } from "next/cache";
import {
  PageOptions,
  FetchOptions,
  Page,
  ErrorPage,
} from "@sitecore-content-sdk/content/client";
import client from "./sitecore-client";
import {
  LayoutServiceData,
  RouteOptions,
} from "node_modules/@sitecore-content-sdk/content/types/layout/models";
import {
  ComponentMap,
  ComponentPropsCollection,
  DictionaryPhrases,
  NextjsContentSdkComponent,
} from "@sitecore-content-sdk/nextjs";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next/types";

export async function getPage(
  path: string | string[],
  pageOptions: PageOptions,
  options?: FetchOptions
): Promise<Page | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("page", "sitecore-content");
  return await client.getPage(path, pageOptions, options);
}

export async function getErrorPage(
  code: ErrorPage,
  pageOptions?: Partial<RouteOptions>,
  options?: FetchOptions
): Promise<Page | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("page", "sitecore-content");
  return await client.getErrorPage(code, pageOptions, options);
}

export async function getComponentData(
  layoutData: LayoutServiceData,
  context: GetServerSidePropsContext | GetStaticPropsContext,
  components: ComponentMap<NextjsContentSdkComponent>
): Promise<ComponentPropsCollection> {
  "use cache";
  cacheLife("hours");
  cacheTag("component", "sitecore-content");
  return await client.getComponentData(layoutData, context, components);
}

export async function getDictionary(
  routeOptions?: Partial<RouteOptions>,
  options?: FetchOptions
): Promise<DictionaryPhrases> {
  "use cache";
  cacheLife("hours");
  cacheTag("page", "sitecore-content");
  return await client.getDictionary(routeOptions, options);
}
