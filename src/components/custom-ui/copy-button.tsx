import * as React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
    text: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-6 p-1"
            onClick={handleCopy}
        >
            {copied ? <><Check />Copied</> :
                <><Copy /> Copy</>
            }
        </Button>
    );
};
