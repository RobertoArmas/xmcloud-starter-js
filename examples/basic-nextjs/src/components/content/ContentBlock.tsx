import { Field, RichText, Text } from "@sitecore-content-sdk/nextjs";

type Fields = {
  heading: Field<string>;
  copy: Field<string>;
};

type ContentBlockProps = {
  fields: Fields;
};
export default function ContentBlock({ fields }: ContentBlockProps) {
  return (
    <section className="content-block">
      <Text field={fields.heading} tag="h2" />
      <RichText field={fields.copy} />
    </section>
  );
}
