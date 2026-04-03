import React from "react";
import { Text, RichText } from "@sitecore-content-sdk/nextjs";

type TextField = { value: string };
type RichTextField = { value: string };

type Fields = {
  heading?: TextField;
  copy?: RichTextField;
};

type Rendering = {
  uid?: string;
  params?: Record<string, string | undefined>;
  dataSource?: string;
};

type SiavariantV3Props = {
  fields?: Fields;
  rendering?: Rendering;
};

export const SiavariantV3 = (
  props: SiavariantV3Props = {
    fields: { heading: { value: "" }, copy: { value: "" } },
    rendering: {},
  }
) => {
  if (!props?.fields) return null;
  const fields = props?.fields;
  const rendering = props?.rendering;

  const variantParam = rendering?.params?.Variant?.toLowerCase();
  const variant =
    variantParam === "compact" ||
    variantParam === "spacious" ||
    variantParam === "balanced"
      ? variantParam
      : "balanced";

  const headingSizeParam = rendering?.params?.HeadingSize?.toLowerCase();
  const headingAlignParam = rendering?.params?.HeadingAlign?.toLowerCase();
  const headingColorParam = rendering?.params?.HeadingColor?.toLowerCase();

  const spacingScale: Record<string, string> = {
    none: "0",
    xs: "1",
    sm: "2",
    md: "4",
    lg: "6",
    xl: "8",
    "2xl": "10",
  };

  const mlParam = (rendering?.params?.MarginLeft || "").toLowerCase();
  const mrParam = (rendering?.params?.MarginRight || "").toLowerCase();
  const plParam = (rendering?.params?.PaddingLeft || "").toLowerCase();
  const prParam = (rendering?.params?.PaddingRight || "").toLowerCase();

  const mlClass =
    mlParam && spacingScale[mlParam] ? `ml-${spacingScale[mlParam]}` : "";
  const mrClass =
    mrParam && spacingScale[mrParam] ? `mr-${spacingScale[mrParam]}` : "";
  const plClass =
    plParam && spacingScale[plParam] ? `pl-${spacingScale[plParam]}` : "";
  const prClass =
    prParam && spacingScale[prParam] ? `pr-${spacingScale[prParam]}` : "";

  const wrapperBase =
    "w-full rounded-xl shadow-md ring-1 ring-black/10 dark:ring-white/15 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800";
  const variantClasses: Record<string, string> = {
    compact: "p-2 space-y-2",
    balanced: "p-4 space-y-4",
    spacious: "p-8 space-y-6",
  };

  const sizeClasses: Record<string, string> = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
    xl: "text-4xl md:text-5xl",
  };
  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  const colorClasses: Record<string, string> = {
    slate: "text-slate-900 dark:text-slate-100",
    indigo: "text-indigo-900 dark:text-indigo-200",
    gray: "text-gray-900 dark:text-gray-100",
    blue: "text-blue-900 dark:text-blue-200",
    emerald: "text-emerald-900 dark:text-emerald-200",
  };

  const sizeClass = sizeClasses[headingSizeParam || "md"] || sizeClasses["md"];
  const alignClass =
    alignClasses[headingAlignParam || "left"] || alignClasses["left"];
  const defaultColor = variantParam === "variant" ? "indigo" : "slate";
  const colorClass =
    colorClasses[headingColorParam || defaultColor] ||
    colorClasses[defaultColor];

  const headingId = rendering?.uid ? `${rendering?.uid}-heading` : undefined;

  return (
    <section
      aria-labelledby={headingId}
      className={`${wrapperBase} ${variantClasses[variant]} ${mlClass} ${mrClass} ${plClass} ${prClass}`}
    >
      <Text
        id={headingId}
        field={fields?.heading}
        tag="h2"
        className={`${sizeClass} ${alignClass} ${colorClass} font-semibold leading-tight`}
      />
      <article className="max-w-none text-slate-700 dark:text-slate-200">
        <RichText field={fields?.copy} />
      </article>
    </section>
  );
};
