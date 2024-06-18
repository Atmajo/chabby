import { Button } from "@/components/ui/button";
import Link from "next/link";

const Landing = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <Link href="/home">
          <Button variant="link">Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
