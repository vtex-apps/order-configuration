import React, { FC } from 'react'
import { find, propEq, path, pathOr } from 'ramda'
import { RadioGroup as StyleguideRadioGroup } from 'vtex.styleguide'
import {
  UseRadioReturnType,
  Controller,
  useRadio,
} from 'react-hook-form-jsonschema'

import { useFormattedError } from '../hooks/useErrorMessage'
import { BaseInputProps } from '../typings/InputProps'
import { FormField } from '../typings/FormProps'

type RadioGroupFields = {
  formFields: FormField[]
}

type DefaultValues = {
  defaultValues: {
    [key: string]: string
  }
}

export const RadioGroupInput: FC<BaseInputProps & RadioGroupFields & DefaultValues> = props => {
  const { pointer, label } = props
  const radioObject = useRadio(pointer)
  return <RadioGroup radioObject={radioObject} label={label} formFields={props.formFields} defaultValues={props.defaultValues} />
}

export const RadioGroup: FC<{
  radioObject: UseRadioReturnType
  label?: string
  formFields: FormField[]
  defaultValues: {
    [key: string]: string
  }
}> = props => {
  const { radioObject, formFields, defaultValues } = props
  const error = radioObject.getError()

  const subSchema = radioObject.getObject()
  const label = props.label ?? subSchema.title ?? radioObject.name

  const keyValueOptions = pathOr([], ['options'], find(propEq('name', radioObject.name), formFields))
  const defaultValue = path([radioObject.name], defaultValues)

  return (
    <Controller
      name={radioObject.pointer}
      control={radioObject.formContext.control}
      rules={radioObject.validator}
      defaultValue={defaultValue}
      as={
        <StyleguideRadioGroup
          name={label}
          required={radioObject.isRequired}
          hideBorder
          label={label}
          options={radioObject.getItems().map(value => {
            return { value, label: pathOr(value, ['label'], find(propEq('value', value), keyValueOptions)) }
          })}
          error={!!error}
          errorMessage={useFormattedError(error)}
        />
      }
    />
  )
}
