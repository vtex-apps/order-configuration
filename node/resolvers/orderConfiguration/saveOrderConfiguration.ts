import {fromFieldArrayFormat} from "../../utils/fromFieldArrayFormat";
import {RepositoryFactory} from "../../repositories/RepositoryFactory";

interface Args {
  orderConfig: {
    fields: { Key: string; Value: string }[];
  };
}

const VTEX_SESSION = "vtex_session";

export const saveOrderConfiguration = async (
  _: any,
  { orderConfig }: Args,
  ctx: Context
) => {
  const {
    clients: { masterdata, session },
    cookies
  } = ctx;

  const adaptedOrderConfig = fromFieldArrayFormat(orderConfig.fields);

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

  const orderConfigResult = await orderConfigRepository.findOne({
    clientId: client.id,
  });

  if (!orderConfigResult) {
    await orderConfigRepository.save({ clientId: client.id, ...adaptedOrderConfig});
  }
  else {
    await orderConfigRepository.update(orderConfigResult.id, { ...adaptedOrderConfig });
  }

  return true;
};
