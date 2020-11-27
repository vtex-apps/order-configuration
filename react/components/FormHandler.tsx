import React, { FC } from 'react'
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

import SELECT_ORDER_CONFIG_MUTATION from '../mutations/selectOrderConfig.graphql'

const CSS_HANDLES = ['orderConfigFormWrapper'] as const

export const FormHandler: FC<{
  schema: JSONSchemaType
  formProps: FormProps
  onSuccessfulSubmit: () => void
}> = props => {
  const [selectOrderConfig] = useMutation(SELECT_ORDER_CONFIG_MUTATION)
  const [submitState, dispatchSubmitAction] = useSubmitReducer()

  const onSubmit = async ({ data, methods, event }: OnSubmitParameters) => {
    if (event) event.preventDefault()

    dispatchSubmitAction({ type: 'SET_LOADING' })

    try {

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

    await methods.triggerValidation()
  }

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
