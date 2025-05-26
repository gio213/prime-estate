import { dbUser } from "@/actions/user.action";
import StripeCheckout from "@/components/StripeCheckoutClient";
import React from "react";

const page = async ({ params }: { params: Promise<{ creditId: string }> }) => {
  const { creditId } = await params;
  const user = await dbUser();
  if (!user?.email || !user?.name || !user?.id) {
    return <div>Please login to continue</div>;
  }
  return (
    <div>
      <StripeCheckout
        productId={creditId}
        userEmail={user.email}
        userName={user.name}
        userId={user.id}
      />
    </div>
  );
};

export default page;
