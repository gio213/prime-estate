import { get_current_user } from "@/actions/user.action";
import { cache } from "react";

export const getUserCredit = cache(async () => {
  const userData = await get_current_user();

  if (!userData) {
    return null;
  }
  if (userData.credit === 0) {
    return false;
  } else {
    return true;
  }
});
