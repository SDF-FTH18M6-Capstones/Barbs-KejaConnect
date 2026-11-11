import { Navigate, useParams } from "react-router-dom";
import Header from "../../components/Signup/Header";
import RoleTabs from "../../components/Signup/RoleTabs";
import { ROLES } from "../../components/Signup/data/signupRoles";

export default function Signup() {
  const { role } = useParams();
  if (!ROLES[role]) return <Navigate to="/signup/tenant" replace />;
  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-semibold">{ROLES[role].title}</h1>
        <RoleTabs />
      </main>
    </div>
  );
}
