
interface Args {
  orderConfig: string;
}

const CUSTOM_SESSION_KEY = "customSessionKeys";
const CLIENT_ACRONYM = "CL";
const VTEX_SESSION = "vtex_session";

export const selectOrderConfiguration = async (
  _: any,
  { orderConfig }: Args,
  ctx: Context
) => {
  const {
    clients: { masterdata, session },
    cookies
  } = ctx;

  const sessionCookie = cookies.get(VTEX_SESSION);
  const { sessionData } = await session.getSession(sessionCookie!, [
    "profile.email"
  ]);

  const resp = await session.updateSession(CUSTOM_SESSION_KEY, orderConfig, [ "profile.email"],  sessionCookie)

  console.log('heeere', { resp })

  const { value: userEmail } = sessionData.namespaces?.profile?.email;

  const [{ id }] = await masterdata.searchDocuments({
    dataEntity: CLIENT_ACRONYM,
    schema: "v1",
    fields: ["id"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `email=${userEmail}`
  });

  await masterdata.updatePartialDocument({
    dataEntity: "CL",
    schema: "v1",
    fields: { orderConfig },
    id
  });

  return {
    orderConfig
  };
};
