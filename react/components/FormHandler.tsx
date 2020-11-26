import React, { FC, useCallback } from 'react'
import {
  FormContext,
  JSONSchemaType,
  OnSubmitParameters,
} from 'react-hook-form-jsonschema'
import { useMutation } from 'react-apollo'
import { GraphQLError } from 'graphql'
import { useCssHandles } from 'vtex.css-handles'

import { FormProps } from '../typings/FormProps'
import { useSubmitReducer, SubmitContext } from '../logic/formState'

import SET_ORDER_FORM_CUSTOM_DATA_MUTATION from '../mutations/setOrderFormCustomData.graphql'
import SELECT_ORDER_CONFIG_MUTATION from '../mutations/selectOrderConfig.graphql'

const CSS_HANDLES = ['orderConfigFormWrapper'] as const

export const FormHandler: FC<{
  schema: JSONSchemaType
  formProps: FormProps
  email: string | null
  onSuccessfulSubmit: () => void
}> = props => {
  const [setOrderFormCustomData] = useMutation(SET_ORDER_FORM_CUSTOM_DATA_MUTATION)
  const [selectOrderConfig] = useMutation(SELECT_ORDER_CONFIG_MUTATION)
  const [submitState, dispatchSubmitAction] = useSubmitReducer()

  const onSubmit = useCallback(
    async ({ data, methods, event }: OnSubmitParameters) => {
      if (event) {
        event.preventDefault()
      }
      dispatchSubmitAction({ type: 'SET_LOADING' })

      try {

        await setOrderFormCustomData({
          variables: {
            appId: 'orderConfig',
            field: 'values',
            value: JSON.stringify(data),
          }
        })

        await selectOrderConfig({
          variables: {
            orderConfig: JSON.stringify(data),
          }
        })

        dispatchSubmitAction({ type: 'SET_SUCCESS' })
        const { onSuccessfulSubmit } = props
        onSuccessfulSubmit()
      } catch (e) {
        if (!e.graphQLErrors) return dispatchSubmitAction({ type: 'SET_SERVER_INTERNAL_ERROR' })

        for (const graphqlError of e.graphQLErrors as GraphQLError[]) {
          dispatchSubmitAction({
            type: graphqlError.extensions?.exception?.name === 'UserInputError' ?
              'SET_USER_INPUT_ERROR' :
              'SET_SERVER_INTERNAL_ERROR'
          })
        }
      }

      methods.triggerValidation()

    },
    [
      dispatchSubmitAction,
    ]
  )

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <FormContext
      schema={props.schema}
      onSubmit={onSubmit}
    >
      <SubmitContext.Provider value={submitState}>
        <div className={handles.orderConfigFormWrapper}>
          {props.children}
        </div>
      </SubmitContext.Provider>
    </FormContext>
  )
}
