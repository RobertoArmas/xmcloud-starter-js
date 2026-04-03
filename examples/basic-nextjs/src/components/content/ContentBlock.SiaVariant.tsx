import React from "react";
import { Field, RichText, Text } from "@sitecore-content-sdk/nextjs";
import { cacheLife, cacheTag } from "next/cache";

type Fields = {
  heading?: Field<string>;
  copy?: Field<string>;
};

type Rendering = {
  uid?: string;
  params?: Record<string, string>;
  dataSource?: string;
};

type DefaultProps = {
  fields?: Fields;
  rendering?: Rendering;
};

export const SiaVariant = async (
  props: DefaultProps = {
    fields: {
      heading: { value: "" } as Field<string>,
      copy: { value: "" } as Field<string>,
    },
    rendering: {},
  }
): Promise<React.JSX.Element | null> => {
  "use cache";
  cacheLife("hours");
  cacheTag("pokeapi");
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  const data = await response.json();
  if (!props?.fields) return null;
  const fields = props?.fields;
  const layout = props?.rendering?.params?.layout || "stack";
  const align = props?.rendering?.params?.align || "left";
  const variant = props?.rendering?.params?.variant || "Variant";
  const headingId = props?.rendering?.uid
    ? `sc-${props?.rendering?.uid}-heading`
    : undefined;

  const alignClass =
    align === "center"
      ? "text-center items-center"
      : align === "right"
      ? "text-right items-end"
      : "text-left items-start";
  const layoutClass =
    layout === "inline"
      ? "md:flex md:flex-row md:items-start md:gap-8"
      : "flex flex-col";
  const brandClass =
    variant === "Variant"
      ? "bg-indigo-50 text-slate-900"
      : "bg-white text-slate-900";
  const headingAccentClass =
    variant === "Variant" ? "text-indigo-900" : "text-slate-900";

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full ${brandClass} rounded-xl border border-slate-200 shadow-sm p-6 md:p-8`}
    >
      <div className={`mx-auto max-w-5xl ${layoutClass} ${alignClass} gap-4`}>
        <div className="w-full">
          <Text
            field={fields?.heading as Field<string>}
            tag="h2"
            className={`text-2xl md:text-3xl font-semibold leading-tight ${headingAccentClass}`}
            id={headingId}
          />
        </div>
        <article className="prose prose-slate max-w-none">
          <RichText field={fields?.copy as Field<string>} />
        </article>
        <div>Poke API Response: {data.name}</div>
      </div>
    </section>
  );
};
