import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Brand() {
  const navigate = useNavigate();
  return (
    <div
      className="flex gap-2 items-center"
      onClick={() => navigate("/listings")}
    >
      <img src={logo} alt="" className="h-10 w-10 object-contain" />
      <p className="text-2xl font-semibold text-primary">KejaConnect</p>
    </div>
  );
}
