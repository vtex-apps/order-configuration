import React, { FC, useCallback } from 'react'
import { compose } from 'ramda'
import { withSession } from 'vtex.render-runtime'
import {
  FormContext,
  JSONSchemaType,
  // JSONSubSchemaInfo,
  // getDataFromPointer,
  OnSubmitParameters,
} from 'react-hook-form-jsonschema'
import { graphql } from 'react-apollo'
import { GraphQLError } from 'graphql'

import updateCustomSessionKeys from '../mutations/updateCustomSessionKeys.graphql'
import { FormProps } from '../typings/FormProps'
// import { parseMasterDataError } from '../logic/masterDataError'
import { useSubmitReducer, SubmitContext } from '../logic/formState'

const FormHandler: FC<{
  schema: JSONSchemaType
  formProps: FormProps
  email: string | null
  onSuccessfulSubmit: () => void
  updateCustomSessionKeyMutation: (s: {}) => Promise<void>
}> = props => {
  const { updateCustomSessionKeyMutation } = props

  // const masterDataErrors = useMemo(() => parseMasterDataError(error), [error])
  // const [lastErrorFieldValues, setLastErrorFieldValues] = useState<
  //   Record<string, string>
  // >({})

  const [submitState, dispatchSubmitAction] = useSubmitReducer()

  const onSubmit = useCallback(
    async ({ data, methods, event }: OnSubmitParameters) => {
      if (event) {
        event.preventDefault()
      }
      dispatchSubmitAction({ type: 'SET_LOADING' })

      const sessionData = { ...data, email: props.email }

      await updateCustomSessionKeyMutation({
        variables: {
          sessionData: { sessionData: sessionData },
        },
      })
        .then(data => {
          console.log(data)
          dispatchSubmitAction({ type: 'SET_SUCCESS' })
          const { onSuccessfulSubmit } = props
          onSuccessfulSubmit()
        })
        .catch(e => {
          // setLastErrorFieldValues(data)

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
      dispatchSubmitAction,
    ]
  )

  return (
    <FormContext
      schema={props.schema}
      onSubmit={onSubmit}
      // customValidators={{
      //   graphqlError: (value, context: JSONSubSchemaInfo) => {
      //     const lastValue = getDataFromPointer(
      //       context.pointer,
      //       lastErrorFieldValues
      //     )
      //     if (
      //       masterDataErrors[context.pointer] &&
      //       ((!lastValue && !value) || lastValue === value)
      //     ) {
      //       return masterDataErrors[context.pointer][0]
      //     }
      //     return true
      //   },
      // }}
    >
      <SubmitContext.Provider value={submitState}>
        {props.children}
      </SubmitContext.Provider>
    </FormContext>
  )
}

// const options = {
//   name: 'session',
//   options: () => ({
//     ssr: false,
//   }),
// }

const EnhancedFormHandler = withSession({ loading: React.Fragment })(
  compose(
    // graphql(sessionQuery, options),
    graphql(updateCustomSessionKeys, { name: 'updateCustomSessionKeyMutation' }),
    // graphql(impersonateMutation, { name: 'impersonate' }),
  )(FormHandler as any)
)

export default EnhancedFormHandler
