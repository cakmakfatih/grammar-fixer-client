import { ReactNode } from "react";

export function MainLayoutComponent({ children }: { children?: ReactNode }) {
  return (
    <div className="bg-gray-800 absolute left-0 top-0 h-screen w-screen flex items-stretch min-h-0 overflow-x-hidden subpixel-antialiased">
      {children}
    </div>
  );
}
