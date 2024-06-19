import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Loader = ({ color }: { color: string | undefined }) => {
  return (
    <div className="flex items-center gap-x-2">
      <Loader2 className={cn("animate-spin", color)}/>
      <h1 className="text-sm text-muted-foreground">Hold your horses !</h1>
    </div>
  );
};

export default Loader;
