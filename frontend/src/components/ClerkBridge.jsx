import { useAuth} from "@clerk/react";
 
import { useEffect } from "react";
import { registerTokenGetter } from "../../src/api/AxiosClient";
 
// Mount this ONCE, inside <ClerkProvider> near the root of the app.
// It doesn't render anything — it just wires Clerk's getToken into the
// axios client so every api/*.js call gets an auth header automatically.
export default function ClerkTokenBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    registerTokenGetter(getToken);
  }, [getToken]);

  return null;
}