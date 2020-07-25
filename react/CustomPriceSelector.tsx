import React from 'react'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'

import getCustomSessionKeys from './queries/getCustomSessionKeys.graphql'
import getProfile from './queries/getProfile.graphql'
import { OrderConfigurationContextProvider } from './OrderConfigurationContext'

const CSS_HANDLES = ['loader'] as const

type Props = {
  children: any
}

const CustomPriceSelector: StorefrontFunctionComponent<Props> = props => {
  const { data: customSessionData, loading: customSessionLoading } = useQuery(
    getCustomSessionKeys,
    {
      ssr: false,
    }
  )

  const { data: profileData, loading: profileLoading } = useQuery(getProfile)

  const handles = useCssHandles(CSS_HANDLES)

  if (profileLoading || customSessionLoading) {
    return (
      <div className={`h-100 flex items-center ${handles.loader}`}>
        Loading...
      </div>
    )
  }

  return (
    <OrderConfigurationContextProvider
      customSessionData={customSessionData}
      profileData={profileData}
    >
      {props.children}
    </OrderConfigurationContextProvider>
  )

}

export default CustomPriceSelector
