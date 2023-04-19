import { Outlet, useLocation } from "react-router-dom";
import FullScreenCard from "../../components/FullScreenCard";
import Link from "../../components/Link";

const AuthLayout = () => {
  const location = useLocation();
  const isloginPage = location.pathname === "/login";

  return (
    <FullScreenCard>
      <FullScreenCard.Body>
        <Outlet />
      </FullScreenCard.Body>
      <FullScreenCard.BelowCard>
        <Link to={isloginPage ? "/signup" : "/login"}>
          {isloginPage ? "Create account" : "login"}
        </Link>{" "}
      </FullScreenCard.BelowCard>
    </FullScreenCard>
  );
};

export default AuthLayout;
