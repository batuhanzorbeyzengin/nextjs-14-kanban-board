import Nav from "@/components/Nav";
import { Ellipsis } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="lg:flex">
        <div className="scrollable-area relative w-full flex-col hidden bg-zinc-50 h-screen lg:flex lg:flex-col lg:border-r lg:w-60 xl:w-72">
          <div className="bg-zinc-50 p-3">
            <div className="flex w-full flex-col text-sm">
              <Nav />
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          <div className="scrollable-area relative flex w-full flex-col">
            <header className="sticky inset-x-0 top-0 z-10 mx-auto flex h-12 w-full shrink-0 items-center overflow-hidden border-b bg-white text-sm font-medium lg:hidden">
              <div className="flex size-full items-center px-3">
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex flex-1 items-center gap-1">
                    <Ellipsis size="16" />
                  </div>
                </div>
              </div>
            </header>
            <div className="content-wrapper">
              <div className="content">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
