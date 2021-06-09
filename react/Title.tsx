import React, { useCallback } from 'react'
import { filter, pick, values } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import {
  useOrderConfigurationDispatch,
  useOrderConfiguration,
} from './OrderConfigurationContext'
const CSS_HANDLES = ['title', 'titleValues', 'titleWrapper'] as const

const Title: StorefrontFunctionComponent<{
  formTitle: string
}> = props => {
  const handles = useCssHandles(CSS_HANDLES)
  const { selectedValues, formFields } = useOrderConfiguration()
  const dispatch = useOrderConfigurationDispatch()
  const { formTitle } = props
  const onModalOpen = useCallback(() => {
    dispatch({ type: 'SET_MODAL_OPEN', args: { isModalOpen: true } })
  }, [dispatch])

  return (
    <div
      onClick={onModalOpen}
      aria-hidden="true"
      className={`flex items-center shadow-hover ${handles.titleWrapper}`}
    >
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
