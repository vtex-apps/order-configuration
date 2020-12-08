import {toFieldArrayFormat} from "../../utils/toFieldArrayFormat";
import {RepositoryFactory} from "../../repositories/RepositoryFactory";

export const VTEX_SESSION = "vtex_session";

export const getOrderConfiguration = async (_: any, __: void, ctx: Context) => {
  const {
    clients: { masterdata, session },
    cookies
  } = ctx;

  const sessionCookie = cookies.get(VTEX_SESSION);
  const { sessionData } = await session.getSession(sessionCookie!, [
    "profile.email"
  ]);
  const clientRepository = RepositoryFactory.getClientRepository(masterdata);
  const orderConfigRepository = RepositoryFactory.getOrderConfigurationRepository(masterdata);

  const userEmail = sessionData.namespaces?.profile?.email?.value;

  if(!userEmail) {
    return false;
  }

  const client = await clientRepository.findOne({
    email: userEmail,
  });

  if(!client) {
    return false;
  }

  const clientId = client.id;

  const orderConfig = await orderConfigRepository.findOne({
    clientId,
  });

  if (!orderConfig) {
    return null;
  }

  return {
    fields: toFieldArrayFormat(orderConfig)
  };
};
