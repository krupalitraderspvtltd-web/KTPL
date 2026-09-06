import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "gu", "hi", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

const navigation = createNavigation(routing);

// Named exports
export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = navigation;

// Default export
// Required by existing pages such as BlogPage
export default Link;