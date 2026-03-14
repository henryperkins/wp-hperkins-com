// packages/route/src/index.ts
import { useRouter } from "@tanstack/react-router";
import {
  Link,
  notFound,
  redirect,
  useLinkProps,
  useNavigate,
  useParams,
  useSearch
} from "@tanstack/react-router";
import { privateApis } from "./private-apis.mjs";
function useInvalidate() {
  const router = useRouter();
  return () => router.invalidate();
}
export {
  Link,
  notFound,
  privateApis,
  redirect,
  useInvalidate,
  useLinkProps,
  useNavigate,
  useParams,
  useSearch
};
//# sourceMappingURL=index.mjs.map
