// const ENVIRONMENTS = {
//   PRODUCTION: "vtexcommercestable",
//   DEV: "vtexcommercebeta"
// };

// import { VTEX_SESSION } from "../session/service";
import { VTEX_SESSION } from '../session/service'

interface Args {
  orderConfig: string;
}

export const selectOrderConfiguration = async (
  _: any,
  { orderConfig }: Args,
  ctx: Context
) => {
  const {
    clients: { masterdata, customSession },
    cookies
  } = ctx;


  const sessionCookie = cookies.get(VTEX_SESSION);
  const { sessionData } = await customSession.getSession(sessionCookie!, [
    "profile.email"
  ]);

  const { value: userEmail } = sessionData.namespaces?.profile?.email;

  const [{ id }] = await masterdata.searchDocuments({
    dataEntity: "CL",
    schema: "v1",
    fields: ["id"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `email=${userEmail}`
  });

  // const res = await masterdata.getSchema({ schema: 'v1', dataEntity: 'CL' })
  //
  const res = await masterdata.updatePartialDocument({
    dataEntity: "CL",
    schema: "v1",
    fields: { orderConfig },
    id
  });

  console.log({ res, id });

  return {
    orderConfig
  };
};
