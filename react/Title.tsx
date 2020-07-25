import React from 'react'
import { omit, pathOr, values } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderConfiguration } from './OrderConfigurationContext'

const CSS_HANDLES = ['title', 'titleValues'] as const

const Title: StorefrontFunctionComponent<{
  formTitle: string
}> = props => {
  const handles = useCssHandles(CSS_HANDLES)
  const { customSessionData } = useOrderConfiguration()
  const defaultValues = omit(
    ['email'],
    JSON.parse(
      pathOr(
        '{}',
        ['getCustomSessionKeys', 'customSessionKeys'],
        customSessionData
      )
    )
  )
  const { formTitle } = props
  return (
    <div>
      <span className={`mr4 ${handles.title}`}>{formTitle}</span>
      <span className={`mr4 fw6 ${handles.titleValues}`}>
        {values(defaultValues)
          .join(', ')}
      </span>
    </div>
  )
}

Title.defaultProps = {
  formTitle: 'Order Configuration'
}

export default Title
