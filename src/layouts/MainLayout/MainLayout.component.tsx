import { ReactNode } from "react";
import { ReactNotifications } from "react-notifications-component";

export function MainLayoutComponent({ children }: { children?: ReactNode }) {
  return (
    <div className="bg-gray-800 absolute left-0 top-0 h-screen w-screen flex items-stretch min-h-0 overflow-x-hidden subpixel-antialiased">
      {children}
      <ReactNotifications />
    </div>
  );
}
