import { Field, RichText, Text } from "@sitecore-content-sdk/nextjs";
import { cacheLife, cacheTag } from "next/cache";

type Fields = {
  heading: Field<string>;
  copy: Field<string>;
};

type ContentBlockProps = {
  fields: Fields;
};
export default async function ContentBlock({ fields }: ContentBlockProps) {
  "use cache";
  cacheLife("hours");
  cacheTag("pokeapi");
  // Call Poke API to get the data
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  const data = await response.json();
  return (
    <section className="content-block">
      <Text field={fields.heading} tag="h2" />
      <RichText field={fields.copy} />
      <div>Poke API Response: {data.name}</div>
    </section>
  );
}
