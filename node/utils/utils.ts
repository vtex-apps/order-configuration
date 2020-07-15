export const getAppConfigs = async (ctx: Context): Promise <DocsBotConfigs> => {
  return ctx.clients.vbase.getJSON(
    'countdown', 'configs'
  )
}

export const updateConfigs = async (ctx: Context, data: any): Promise <any> => {
  const configs = await getAppConfigs(ctx)
  return ctx.clients.vbase.saveJSON(
    'countdown',
    'configs',
    {
      ...configs,
      ...data,
    }
  )
}
