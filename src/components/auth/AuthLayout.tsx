import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal } from "lucide-react";
import { Outlet, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { ComponentWrapper } from "../motion/ComponentWrapper";
import { api } from "@/components/api/fetcher";
import { routes } from "@/components/api/route";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { userAtom } from "@/global/userAtom";

interface Role {
  id: string;
  name: string;
  description: string;
  label: string;
  entity_type: string;
}

interface Profile {
  id: string;
  updated_at: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  address: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  avatar_pic: string | null;
  banner_pic: string | null;
}

interface Entities {
  id: string;
  updated_at: string;
  created_at: string;
  entity_id: string | null;
  entity_type: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  status: string;
  status_2fa: boolean;
  updated_at: string;
  created_at: string;
  role: Role;
  profile: Profile;
  entities: Entities;
}

function AuthLayout() {
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();

  const { data, error, isLoading, isError } = api.get<User>(
    routes.auth.me,
    {},
    {},
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
  // Redirect logic runs exactly once whenever data arrives
  useEffect(() => {
    if (!data) return;

    const handleNavigation = async () => {
      setUser(data);
      switch (data.status) {
        case "profilesetup":
          navigate("/profile-setup", { replace: true });
          break;
        case "entitysetup":
          navigate("/entity-setup", { replace: true });
          break;
        case "accountsetup":
          navigate("/account-setup", { replace: true });
          break;
        default:
          // if they landed on a deep link, let them stay;
          // otherwise send to dashboard
          const p = window.location.pathname;
          navigate(p === "/" ? "/dashboard" : p, { replace: true });
          break;
      }
    };

    handleNavigation();
  }, [data, navigate, setUser]);

  if (isLoading) {
    return (
      <ComponentWrapper keyName="auth-layout-loading">
        <div className="flex flex-col items-center justify-center h-dvh w-full">
          <Loader2 className="animate-spin" />
          <p>Loading....</p>
        </div>
      </ComponentWrapper>
    );
  }

  if (isError) {
    return (
      <ComponentWrapper keyName="auth-layout-error">
        <div className="flex flex-col gap-2 items-center justify-center h-dvh w-full p-4">
          <div className="max-w-md w-full flex flex-col gap-4 items-center justify-center">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>{error?.message}</AlertDescription>
            </Alert>
            <div className="flex gap-2 justify-center items-center">
              <Button
                variant="secondary"
                onClick={() =>
                  (window.location.href = import.meta.env.VITE_APP_AUTH_URL)
                }
              >
                Login Here
              </Button>
            </div>
          </div>
        </div>
      </ComponentWrapper>
    );
  }

  return <Outlet />;
}

export default AuthLayout;
