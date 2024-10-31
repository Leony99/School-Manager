import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default function dashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      {/* Left */}
      <div className="max-h-fit flex-shrink-0 w-[15%] min-w-[60px] max-w-[70px] lg:min-w-[190px] lg:max-w-none p-4">
        <Link href="/" 
        className="flex items-center justify-center lg:justify-start gap-2">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">School Man.</span>
        </Link>
        <Menu />
      </div>
      {/* Right */}
      <div className="w-full bg-[#F7F8FA] flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
