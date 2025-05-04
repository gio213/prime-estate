import { dbUser } from "@/actions/user.action";
import { cache } from "react";

export const getUserCredit = cache(async () => {
  const userData = await dbUser();
  if (!userData) {
    throw new Error("User not found");
  }
  if (userData.credit === 0) {
    return false;
  } else {
    return true;
  }
});
