import { Navigate, useParams } from "react-router-dom";
import SignupHeader from "../../components/Signup/Header";
import RoleTabs from "../../components/Signup/RoleTabs";
import Form from "../../components/Signup/Form";
import SidePanel from "../../components/Signup/SidePanel";
import { ROLES } from "../../components/Signup/data/signupRoles";

export default function Signup() {
  const { role } = useParams();
  if (!ROLES[role]) return <Navigate to="/signup/tenant" replace />;

  return (
    <div className="min-h-screen bg-bg text-text">
      <SignupHeader />
      <main className="mx-auto max-w-5xl space-y-6 px-4 pt-10 pb-14">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{ROLES[role].title}</h1>
          <p className="text-text-muted">{ROLES[role].subtitle}</p>
        </div>
        <RoleTabs />
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <Form key={role} roleId={role} />
          <SidePanel role={ROLES[role]} />
        </div>
      </main>
    </div>
  );
}
