import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard } from "lucide-react";

interface CanListPropertyErrorMessageProps {
  canList: boolean;
  onUpgrade?: () => void;
}

const CanListPropertyErrorMessage = ({
  canList,
  onUpgrade,
}: CanListPropertyErrorMessageProps) => {
  if (canList) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4 mt-1" />
      <div className="ml-2 flex-1">
        <AlertTitle className="text-lg font-semibold">
          Insufficient Credits
        </AlertTitle>
        <AlertDescription className="text-sm mt-2">
          <p className="mb-4">
            You don't have enough credits to list a new property. Please buy
            credit to continue listing properties.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="border-red-700 text-red-700 hover:bg-red-50 hover:text-red-800"
              onClick={onUpgrade}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Credits
            </Button>
            <Button variant="link" className="text-red-700 hover:text-red-800">
              Learn more about our pricing
            </Button>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default CanListPropertyErrorMessage;
