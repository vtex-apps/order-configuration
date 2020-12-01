import { ResolverError } from "@vtex/api";

export const VTEX_SESSION = "vtex_session";

export const customSessionKeys = async (_: any, __: void, ctx: Context) => {
  const {
    clients: { session },
    cookies
  } = ctx;

  const sessionCookie = cookies.get(VTEX_SESSION);

  if (sessionCookie === undefined)
    throw new ResolverError(
      `Invalid request for session, the ${VTEX_SESSION} wasn't provided!`
    );

  const { sessionData } = await session.getSession(sessionCookie, [
    "public.customSessionKeys"
  ]);

  return sessionData.namespaces?.public?.customSessionKeys.value;
};
