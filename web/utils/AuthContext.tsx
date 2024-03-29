import { createContext, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getMe,
  GetMeResult,
  GET_ME,
  login,
  LoginParams,
  logout,
  register,
  RegisterParams,
} from "../api";

interface AuthContext {
  user?: GetMeResult;
  loading: boolean;
  register: (params: RegisterParams) => void;
  login: (params: LoginParams) => void;
  logout: () => void;
}

const AuthCtx = createContext({
  user: undefined,
  loading: true,
} as AuthContext);

export const AuthContext: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const { data: me } = useQuery([GET_ME], getMe, {
    onSettled: () => setLoading(false),
  });

  const { mutate: handleRegister } = useMutation(register, {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_ME]);
    },
  });

  const { mutate: handleLogin } = useMutation(login, {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_ME]);
    },
  });

  const { mutate: handleLogout } = useMutation(logout, {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_ME]);
    },
  });

  return (
    <AuthCtx.Provider
      value={{
        user: me,
        loading,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {loading ? "loading.." : children}
    </AuthCtx.Provider>
  );
};

export const useAuthContext = () => useContext(AuthCtx);
