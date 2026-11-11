import { Navigate, useParams } from "react-router-dom";
import Header from "../../components/Signup/Header";
import RoleTabs from "../../components/Signup/RoleTabs";
import { ROLES } from "../../components/Signup/data/signupRoles";

export default function Signup() {
  const { role } = useParams();
  if (!ROLES[role]) return <Navigate to="/signup/tenant" replace />;
  return (
    <div>
      <Header />
      <RoleTabs />
    </div>
  );
}
