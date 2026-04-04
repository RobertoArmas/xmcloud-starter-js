import { draftMode } from "next/headers";
import { Suspense } from "react";
import Bootstrap from "src/Bootstrap";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    return (
      <Suspense fallback={null}>
        <LayoutContent site={site} isEnabled={isEnabled}>
          {children}
        </LayoutContent>
      </Suspense>
    );
  }

  return (
    <LayoutContent site={site} isEnabled={isEnabled}>
      {children}
    </LayoutContent>
  );
}

function LayoutContent({
  children,
  site,
  isEnabled,
}: {
  children: React.ReactNode;
  site: string;
  isEnabled: boolean;
}) {
  return (
    <>
      <Bootstrap siteName={site} isPreviewMode={isEnabled} />
      {children}
    </>
  );
}
