import { Button } from "@/presentation/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-4xl font-bold mb-8">Learn Fast with AI</h1>
      
      <div className="flex flex-col space-y-4 w-64">
        <Link href="/users">
          <Button variant="default" className="w-full">
            View Users
          </Button>
        </Link>
        <Link href="/users/add">
          <Button variant="default" className="w-full">
            Add New User
          </Button>
        </Link>
      </div>
    </div>
  );
}
