import NavigationBar from "../components/Navigation";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <>
      <NavigationBar />
      <div className="p-10">
        <Outlet />
        <Toaster position="bottom-right" richColors closeButton />
      </div>
    </>
  );
}