import React, { FC } from 'react'
import { path } from 'ramda'
import { Input as StyleguideInput } from 'vtex.styleguide'
import {
  UseRawInputReturnType,
  useInput,
  usePassword,
  useHidden,
} from 'react-hook-form-jsonschema'

import { useFormattedError } from '../hooks/useErrorMessage'
import { FormRawInputProps } from '../typings/InputProps'
import { useOrderConfiguration } from '../OrderConfigurationContext'

export const HiddenInput: FC<FormRawInputProps> = props => {
  const { pointer } = props
  const inputObject = useHidden(pointer)
  return <input {...inputObject.getInputProps()} />
}

export const PasswordInput: FC<FormRawInputProps> = props => {
  const { pointer, label } = props
  const inputObject = usePassword(pointer)
  return <Input inputObject={inputObject} label={label} />
}

export const RawInput: FC<FormRawInputProps> = props => {
  const { pointer, label } = props
  const inputObject = useInput(pointer)
  const { selectedValues } = useOrderConfiguration()
  return <Input inputObject={inputObject} label={label} defaultValues={selectedValues} />
}

export const Input: FC<{
  inputObject: UseRawInputReturnType
  label?: string
  defaultValues?: {
    [key: string]: string
  }
}> = props => {
  const { inputObject, defaultValues } = props
  const error = inputObject.getError()

  const subSchema = inputObject.getObject()
  const label = props.label ?? subSchema.title ?? inputObject.name

  const defaultValue = path([inputObject.name], defaultValues)

  return (
    <StyleguideInput
      {...inputObject.getInputProps()}
      label={label}
      defaultValue={defaultValue}
      error={!!error}
      errorMessage={useFormattedError(error)}
    />
  )
}
