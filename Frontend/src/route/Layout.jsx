import NavigationBar from "../components/Navigation";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <NavigationBar />
      <div className="p-10">
        <Outlet />
      </div>
    </>
  );
}