import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Loader = ({ color }: { color: string }) => {
  return <Loader2 className={cn("w-32 animate-spin", color)}/>;
};

export default Loader;
