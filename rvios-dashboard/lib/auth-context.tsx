"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import {
  login as apiLogin,
  logout as apiLogout,
  refreshTokens,
  registerRefreshHandler,
} from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthCtx {
  token: string | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  ready: boolean;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

const ACCESS = "rvios_access";
const REFRESH = "rvios_refresh";
const USER = "rvios_user";

/* التوكن يُرسَل إلى الـ API عبر ترويسة Authorization فقط، فلا داعي لأن
   يرافق كل طلب إلى نفس الأصل. و`strict` يمنع إرساله من مواقع أخرى. */
const COOKIE_OPTS = {
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
  sameSite: "strict" as const,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  /* المرجع يحمل آخر توكن دون إعادة تصيير: `apiFetch` قد يُستدعى من
     إغلاق (closure) التقط قيمة قديمة. */
  const tokenRef = useRef<string | null>(null);
  /* طلب تجديد واحد مشترك: خمسة طلبات ترجع 401 معاً ⇒ خمس محاولات تجديد
     ⇒ أربعة توكنات مُدوَّرة تُعتبر «معادة الاستعمال» فتُبطل الجلسة كلها. */
  const inFlight = useRef<Promise<string | null> | null>(null);

  const clearSession = useCallback(() => {
    Cookies.remove(ACCESS);
    Cookies.remove(REFRESH);
    Cookies.remove(USER);
    tokenRef.current = null;
    setToken(null);
    setUser(null);
  }, []);

  const persist = useCallback(
    (accessToken: string, refreshToken: string, userData: User) => {
      tokenRef.current = accessToken;
      setToken(accessToken);
      setUser(userData);
      Cookies.set(ACCESS, accessToken, { ...COOKIE_OPTS, expires: 1 / 96 }); // 15 دقيقة
      Cookies.set(REFRESH, refreshToken, { ...COOKIE_OPTS, expires: 7 });
      Cookies.set(USER, JSON.stringify(userData), { ...COOKIE_OPTS, expires: 7 });
    },
    [],
  );

  const decodeUser = (accessToken: string): User => {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    return { id: payload.sub, email: payload.email, role: payload.role };
  };

  /** يُستدعى من `apiFetch` عند 401. يرجّع توكناً جديداً أو null. */
  const handleUnauthorized = useCallback(async (): Promise<string | null> => {
    if (inFlight.current) return inFlight.current;

    const refresh = Cookies.get(REFRESH);
    if (!refresh) {
      clearSession();
      return null;
    }

    inFlight.current = (async () => {
      try {
        const t = await refreshTokens(refresh);
        persist(t.accessToken, t.refreshToken, decodeUser(t.accessToken));
        return t.accessToken;
      } catch {
        /* التجديد فشل — الجلسة انتهت فعلاً أو أُبطلت لكشف إعادة استعمال. */
        clearSession();
        if (typeof window !== "undefined") window.location.href = "/login";
        return null;
      } finally {
        inFlight.current = null;
      }
    })();

    return inFlight.current;
  }, [clearSession, persist]);

  useEffect(() => {
    registerRefreshHandler(handleUnauthorized);
    return () => registerRefreshHandler(null);
  }, [handleUnauthorized]);

  // استعادة الجلسة عند الإقلاع
  useEffect(() => {
    const t = Cookies.get(ACCESS);
    const u = Cookies.get(USER);
    if (t && u) {
      try {
        tokenRef.current = t;
        setToken(t);
        setUser(JSON.parse(u));
      } catch {
        clearSession();
      }
    } else if (Cookies.get(REFRESH)) {
      /* انتهى توكن الوصول (١٥ دقيقة) بينما توكن التجديد حيّ (٧ أيام).
         بدون هذا الفرع كان المستخدم يُطرد عند كل عودة بعد ربع ساعة. */
      handleUnauthorized().finally(() => setReady(true));
      return;
    }
    setReady(true);
  }, [clearSession, handleUnauthorized]);

  async function signIn(email: string, password: string) {
    const tokens = await apiLogin(email, password);
    persist(tokens.accessToken, tokens.refreshToken, decodeUser(tokens.accessToken));
  }

  function signOut() {
    const refresh = Cookies.get(REFRESH);
    if (refresh) apiLogout(refresh).catch(() => {});
    clearSession();
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
