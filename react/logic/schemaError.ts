import { ApolloError } from 'apollo-client'
import { GraphQLError } from 'graphql'
import { ErrorTypes } from 'react-hook-form-jsonschema'

const concatFormPointer = (currPath: string, next: string) => {
  return `${currPath}/${next}`
}

export type SchemaErrorRecord = Record<string, ErrorTypes[]>

interface SchemaError {
  Message: string
  LineNumber: number
  LinePosition: number
  Path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Value: any | string[]
  SchemaId: string
  SchemaBaseUri: string | null
  ErrorType: string
  ChildErrors: []
}

const concatErrors = (
  errors: SchemaError[],
  error: { schema: string; errors: SchemaError }
) => {
  if (error.errors) {
    return errors.concat(error.errors)
  }
  return errors
}

const filterSchemaErrors = (
  acc: SchemaError[],
  message: GraphQLError
) => {
  if (message?.extensions?.exception?.response?.data?.errors) {
    return acc.concat(
      message.extensions.exception.response.data.errors.reduce(concatErrors, [])
    )
  }
  return acc
}

const createOrPushError = (
  errorRecord: SchemaErrorRecord,
  pointer: string,
  error: ErrorTypes
) => {
  if (errorRecord[pointer]) {
    errorRecord[pointer].push(error)
  } else {
    errorRecord[pointer] = [error]
  }
}

const evaluateSchemaRequiredErrors = (
  data: { nodes: SchemaErrorRecord; schemaId: string },
  nodeName: string
) => {
  const pointer = concatFormPointer(
    concatFormPointer(data.schemaId, 'properties'),
    nodeName
  )
  createOrPushError(data.nodes, pointer, ErrorTypes.required)
  return { nodes: data.nodes, schemaId: data.schemaId }
}

const evaluateSchemaErrors = (
  acc: SchemaErrorRecord,
  serverError: SchemaError
) => {
  // eslint-disable-next-line default-case
  switch (serverError.ErrorType) {
    case 'required':
      if (Array.isArray(serverError.Value)) {
        acc = serverError.Value.reduce(evaluateSchemaRequiredErrors, {
          nodes: acc,
          schemaId: serverError.SchemaId,
        }).nodes
      }
      break
    case 'format':
    case 'type':
      createOrPushError(acc, serverError.SchemaId, ErrorTypes.pattern)
      break
    case 'maximum':
      createOrPushError(acc, serverError.SchemaId, ErrorTypes.maxValue)
      break
    case 'minimum':
      createOrPushError(acc, serverError.SchemaId, ErrorTypes.minValue)
      break
    case 'enum':
      createOrPushError(acc, serverError.SchemaId, ErrorTypes.notInEnum)
      break
    case 'minLength':
      createOrPushError(acc, serverError.SchemaId, ErrorTypes.minLength)
      break
    case 'maxLength':
      createOrPushError(acc, serverError.SchemaId, ErrorTypes.maxLength)
      break
  }
  return acc
}

export const parseSchemaError = (
  error: ApolloError | undefined
): SchemaErrorRecord => {
  if (!error) {
    return {}
  }

  return error.graphQLErrors
    .reduce(filterSchemaErrors, [])
    .reduce(evaluateSchemaErrors, {})
}
