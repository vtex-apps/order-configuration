import React from 'react'
import { filter, pick, values } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderConfiguration } from './OrderConfigurationContext'

const CSS_HANDLES = ['title', 'titleValues', 'titleWrapper'] as const

const Title: StorefrontFunctionComponent<{
  formTitle: string
}> = props => {
  const handles = useCssHandles(CSS_HANDLES)
  const { selectedValues, formFields } = useOrderConfiguration()
  const { formTitle } = props
  return (
    <div className={`flex items-center ${handles.titleWrapper}`}>
      <span className={`mr4 ${handles.title}`}>{formTitle}</span>
      <span className={`mr4 fw6 ${handles.titleValues}`}>
        {values(
          pick(
            filter(field => field.showInTitle, formFields).map(
              field => field.name
            ),
            selectedValues
          )
        ).join(', ')}
      </span>
    </div>
  )
}

Title.defaultProps = {
  formTitle: 'Order Configuration',
}

export default Title
