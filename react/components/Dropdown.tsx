import React, { FC, useMemo } from 'react'
import { find, propEq, path, pathOr } from 'ramda'
import { Dropdown as StyleguideDropdown } from 'vtex.styleguide'
import {
  Controller,
  UseSelectReturnType,
  useSelect,
} from 'react-hook-form-jsonschema'

import { useFormattedError } from '../hooks/useErrorMessage'
import { BaseInputProps } from '../typings/InputProps'
import { FormField } from '../typings/FormProps'
import { useOrderConfiguration } from '../OrderConfigurationContext'

export const DropdownInput: FC<BaseInputProps> = props => {
  const selectObject = useSelect(props.pointer)
  const { selectedValues, formFields } = useOrderConfiguration()
  return <Dropdown selectObject={selectObject} label={props.label} formFields={formFields} defaultValues={selectedValues} />
}

export const Dropdown: FC<{
  selectObject: UseSelectReturnType
  label?: string
  formFields: FormField[]
  defaultValues: {
    [key: string]: string
  }
}> = props => {
  const { selectObject, formFields, defaultValues } = props
  const error = selectObject.getError()

  const subSchema = selectObject.getObject()
  const label = props.label ?? subSchema.title ?? selectObject.name

  const items = selectObject.getItems()
  const keyValueOptions = pathOr([], ['options'], find(propEq('name', selectObject.name), formFields))
  const defaultValue = path([selectObject.name], defaultValues)
  const options = useMemo(() => {
    return items.map(value => {
      return { value, label: pathOr(value, ['label'], find(propEq('value', value), keyValueOptions)) }
    })
  }, [items])

  return (
    <>
      <Controller
        name={selectObject.pointer}
        control={selectObject.formContext.control}
        rules={selectObject.validator}
        defaultValue={defaultValue}
        as={
          <StyleguideDropdown
            name={label}
            multi={false}
            label={label}
            options={options}
            error={!!error}
            errorMessage={useFormattedError(error)}
          />
        }
      />
    </>
  )
}
