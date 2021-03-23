import { getOrderFormIdFromCookie } from '../../utils'

interface Args {
  orderConfig: string
}

const CUSTOM_SESSION_KEY = 'customSessionKeys'
const CLIENT_ACRONYM = 'CL'
const VTEX_SESSION = 'vtex_session'
const APP_ID = 'order-configuration'
const ORDER_CONFIG_FIELD_MAJOR = 1

const addAppToOrderFormConfiguration = async (ctx: Context) => {
  const {
    clients: { checkout },
  } = ctx

  const orderFormConfiguration = await checkout.getOrderFormConfiguration()
  const hasOrderConfig = orderFormConfiguration.apps.find(
    ({ id }) => id === APP_ID
  )

  if (hasOrderConfig) {
    return
  }

  await checkout.setOrderFormConfiguration(
    {
      ...orderFormConfiguration,
      apps: [
        ...orderFormConfiguration.apps,
        {
          fields: ['values'],
          id: 'order-configuration',
          major: ORDER_CONFIG_FIELD_MAJOR,
        },
      ],
    },
    'STORE_TOKEN'
  )
}

export const selectOrderConfiguration = async (
  _: any,
  { orderConfig }: Args,
  ctx: Context
) => {
  const {
    clients: { masterdata, session, checkout },
    cookies,
  } = ctx

  const sessionCookie = cookies.get(VTEX_SESSION)
  const { sessionData } = await session.getSession(sessionCookie!, [
    'profile.email',
  ])

  await session.updateSession(
    CUSTOM_SESSION_KEY,
    orderConfig,
    [],
    sessionCookie
  )

  await addAppToOrderFormConfiguration(ctx)

  await checkout.setSingleCustomData(getOrderFormIdFromCookie(cookies)!, {
    appFieldName: 'values',
    appId: APP_ID,
    value: JSON.stringify(orderConfig),
  })

  const { value: userEmail } = sessionData.namespaces?.profile?.email

  const [{ id }] = await masterdata.searchDocuments({
    dataEntity: CLIENT_ACRONYM,
    schema: 'v1',
    fields: ['id'],
    pagination: {
      page: 1,
      pageSize: 1,
    },
    where: `email=${userEmail}`,
  })

  await masterdata.updatePartialDocument({
    dataEntity: 'CL',
    schema: 'v1',
    fields: { orderConfig },
    id,
  })

  return {
    orderConfig,
  }
}
