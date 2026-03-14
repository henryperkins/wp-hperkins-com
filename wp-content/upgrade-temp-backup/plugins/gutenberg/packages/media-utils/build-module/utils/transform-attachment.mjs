// packages/media-utils/src/utils/transform-attachment.ts
function transformAttachment(attachment) {
  const { alt_text, source_url, ...savedMediaProps } = attachment;
  return {
    ...savedMediaProps,
    alt: attachment.alt_text,
    caption: attachment.caption?.raw ?? "",
    title: attachment.title.raw,
    url: attachment.source_url,
    poster: attachment._embedded?.["wp:featuredmedia"]?.[0]?.source_url || void 0
  };
}
export {
  transformAttachment
};
//# sourceMappingURL=transform-attachment.mjs.map
