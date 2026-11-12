import Brand from "../Brand";

export default function SideBar({ mode, children }) {
  //todo:use user sessions to check mode
  return (
    <aside
      className={`flex flex-col px-5 py-5 gap-8 sticky top-0 h-screen  ${mode == "admin" ? "bg-accent/20" : "none"}`}
    >
      <div className="flex justify-between items-center">
        <Brand />
        <div className="flex text-lg font-semibold text-accent">
          {mode == "admin" ? "Admin" : ""}
        </div>
      </div>
      <div className="side-navlinks flex flex-col flex-1  gap-1 justify-start">
        {children}
      </div>
      <div className="flex gap-2  border-t border-gray-200 pt-4">
        <div className="flex rounded-full bg-text-muted h-10 w-10 justify-center items-center">
          KM
        </div>
        <div className="flex flex-col items-start justify-center">
          <div className="flex justify-center items-center">User name</div>
          <div className="flex justify-center items-center text-sm">
            Log out
          </div>
        </div>
      </div>
    </aside>
  );
}
