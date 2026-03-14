// packages/media-fields/src/filesize/index.tsx
import { __, sprintf, _x } from "@wordpress/i18n";
var KB_IN_BYTES = 1024;
var MB_IN_BYTES = 1024 * KB_IN_BYTES;
var GB_IN_BYTES = 1024 * MB_IN_BYTES;
var TB_IN_BYTES = 1024 * GB_IN_BYTES;
var PB_IN_BYTES = 1024 * TB_IN_BYTES;
var EB_IN_BYTES = 1024 * PB_IN_BYTES;
var ZB_IN_BYTES = 1024 * EB_IN_BYTES;
var YB_IN_BYTES = 1024 * ZB_IN_BYTES;
function getBytesString(bytes, unitSymbol, decimals = 2) {
  return sprintf(
    // translators: 1: Actual bytes of a file. 2: The unit symbol (e.g. MB).
    _x("%1$s %2$s", "file size"),
    bytes.toLocaleString(void 0, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }),
    unitSymbol
  );
}
function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) {
    return getBytesString(0, _x("B", "unit symbol"), decimals);
  }
  const quant = {
    /* translators: Unit symbol for yottabyte. */
    [_x("YB", "unit symbol")]: YB_IN_BYTES,
    /* translators: Unit symbol for zettabyte. */
    [_x("ZB", "unit symbol")]: ZB_IN_BYTES,
    /* translators: Unit symbol for exabyte. */
    [_x("EB", "unit symbol")]: EB_IN_BYTES,
    /* translators: Unit symbol for petabyte. */
    [_x("PB", "unit symbol")]: PB_IN_BYTES,
    /* translators: Unit symbol for terabyte. */
    [_x("TB", "unit symbol")]: TB_IN_BYTES,
    /* translators: Unit symbol for gigabyte. */
    [_x("GB", "unit symbol")]: GB_IN_BYTES,
    /* translators: Unit symbol for megabyte. */
    [_x("MB", "unit symbol")]: MB_IN_BYTES,
    /* translators: Unit symbol for kilobyte. */
    [_x("KB", "unit symbol")]: KB_IN_BYTES,
    /* translators: Unit symbol for byte. */
    [_x("B", "unit symbol")]: 1
  };
  for (const [unit, mag] of Object.entries(quant)) {
    if (bytes >= mag) {
      return getBytesString(bytes / mag, unit, decimals);
    }
  }
  return "";
}
var filesizeField = {
  id: "filesize",
  type: "text",
  label: __("File size"),
  getValue: ({ item }) => item?.media_details?.filesize ? formatFileSize(item?.media_details?.filesize) : "",
  isVisible: (item) => {
    return !!item?.media_details?.filesize;
  },
  enableSorting: false,
  filterBy: false,
  readOnly: true
};
var filesize_default = filesizeField;
export {
  filesize_default as default
};
//# sourceMappingURL=index.mjs.map
