import { enCommon } from "./en/common";
import { enLanding } from "./en/landing";
import { enPages } from "./en/pages";
import { enAdmin } from "./en/admin";

/** French source string -> English translation. */
export const en: Record<string, string> = {
  ...enCommon,
  ...enLanding,
  ...enPages,
  ...enAdmin,
};
