import React, { FC, useMemo, useState, useCallback } from 'react'
import {
  FormContext,
  JSONSchemaType,
  JSONSubSchemaInfo,
  getDataFromPointer,
  OnSubmitParameters,
} from 'react-hook-form-jsonschema'
import { useMutation } from 'react-apollo'
import { GraphQLError } from 'graphql'

import updateCustomSessionKeys from '../mutations/updateCustomSessionKeys.graphql'
import setOrderFormCustomData from '../mutations/setOrderFormCustomData.graphql'
import { FormProps } from '../typings/FormProps'
import { parseSchemaError } from '../logic/schemaError'
import { useSubmitReducer, SubmitContext } from '../logic/formState'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['orderConfigFormWrapper'] as const

export const FormHandler: FC<{
  schema: JSONSchemaType
  formProps: FormProps
  email: string | null
  onSuccessfulSubmit: () => void
}> = props => {
  const [updateCustomSessionKeyMutation, { error }] = useMutation(updateCustomSessionKeys)
  const [updateOrderFormCustomData] = useMutation(setOrderFormCustomData)

  const schemaErrors = useMemo(() => parseSchemaError(error), [error])
  const [lastErrorFieldValues, setLastErrorFieldValues] = useState<
    Record<string, string>
  >({})

  const [submitState, dispatchSubmitAction] = useSubmitReducer()

  const onSubmit = useCallback(
    async ({ data, methods, event }: OnSubmitParameters) => {
      if (event) {
        event.preventDefault()
      }
      dispatchSubmitAction({ type: 'SET_LOADING' })

      await fetch('/api/sessions/', {
        method: 'POST',
        body: JSON.stringify({
      "public":{
      "customSessionKeys":{
      "value": JSON.stringify(data)
      }
      }
        }),
        credentials: 'same-origin',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })      
        
      await updateOrderFormCustomData({
            variables: {
              appId: 'orderConfig',
              field: 'values',
              value: JSON.stringify(data),
            }
          }).then(() => {
            dispatchSubmitAction({ type: 'SET_SUCCESS' })
            const { onSuccessfulSubmit } = props
            onSuccessfulSubmit()
          })
        
        .catch(e => {
          setLastErrorFieldValues(data)

          if (e.graphQLErrors) {
            for (const graphqlError of e.graphQLErrors as GraphQLError[]) {
              if (
                graphqlError.extensions?.exception?.name === 'UserInputError'
              ) {
                dispatchSubmitAction({ type: 'SET_USER_INPUT_ERROR' })
              } else {
                dispatchSubmitAction({
                  type: 'SET_SERVER_INTERNAL_ERROR',
                })
              }
            }
          } else {
            dispatchSubmitAction({ type: 'SET_SERVER_INTERNAL_ERROR' })
          }

          methods.triggerValidation()
        })
    },
    [
      updateCustomSessionKeyMutation,
      updateOrderFormCustomData,
      dispatchSubmitAction,
    ]
  )

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <FormContext
      schema={props.schema}
      onSubmit={onSubmit}
      customValidators={{
        graphqlError: (value, context: JSONSubSchemaInfo) => {
          const lastValue = getDataFromPointer(
            context.pointer,
            lastErrorFieldValues
          )
          if (
            schemaErrors[context.pointer] &&
            ((!lastValue && !value) || lastValue === value)
          ) {
            return schemaErrors[context.pointer][0]
          }
          return true
        },
      }}
    >
      <SubmitContext.Provider value={submitState}>
        <div className={handles.orderConfigFormWrapper}>
          {props.children}
        </div>
      </SubmitContext.Provider>
    </FormContext>
  )
}
