import React from 'react'
import { contains, pathOr } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { UITypes } from 'react-hook-form-jsonschema'

import { CustomPriceSelectorProps, FormField } from './typings/FormProps'
import { TOAST_DURATION_MS } from './utils/toast'
import { ObjectMapper } from './components/Object'
import { FormHandler } from './components/FormHandler'
import FormSubmit from './FormSubmit'
import { useOrderConfiguration } from './OrderConfigurationContext'
import { ToastConsumer } from 'vtex.styleguide'
import { ToastRenderProps } from './typings/global'

interface CustomPriceSchema {
  type: string
  properties: Record<string, object>
  required: string[]
}

interface FormFieldOption {
  value: string
}

const UI_TYPES = {
  text: UITypes.input,
  select: UITypes.select,
  radio: UITypes.radio,
  checkbox: UITypes.checkbox,
}

const generatePriceSchema = (formFields: FormField[]) =>
  formFields.reduce(
    (acc: CustomPriceSchema, formField) => {
      const hasEnum = contains(pathOr('text', ['fieldType'], formField), [
        'select',
        'radio',
      ])

      const fieldProps = {
        type: formField.type || 'string',
        title: formField.label || formField.name,
        enum: hasEnum
          ? (formField.options || []).map(
              (option: FormFieldOption) => option.value
            )
          : undefined,
        format: formField.format ?? '',
      }

      return {
        ...acc,
        properties: {
          ...acc.properties,
          [formField.name]: fieldProps,
        },
        required: formField.required
          ? [...acc.required, formField.name]
          : acc.required,
      }
    },
    {
      type: 'object',
      properties: {},
      required: [],
    }
  )

const generateUISchema = (formFields: FormField[]) => {
  const properties = formFields.reduce((acc: object, formField) => {
    const fieldType: keyof typeof UI_TYPES = formField.fieldType || 'text'
    return {
      ...acc,
      [formField.name]: {
        type: UI_TYPES[fieldType],
      },
    }
  }, {})
  return { type: UITypes.default, properties }
}

const OrderConfigurationForm: StorefrontFunctionComponent<CustomPriceSelectorProps> = props => {
  const { selectedValues, formFields } = useOrderConfiguration()

  const customPriceSchema: CustomPriceSchema = generatePriceSchema(formFields)
  const UISchema = generateUISchema(formFields)

  return (
    <ToastConsumer>
      {({ showToast }: ToastRenderProps) => {
        const onSuccessfulSubmit = () => {
          window.location.reload()
          showToast({
            message: <FormattedMessage id="store/form.submit.success" />,
            duration: TOAST_DURATION_MS,
          })
        }
        if (!React.Children.count(props.children)) {
          return (
            <FormHandler
              schema={customPriceSchema}
              formProps={props}
              onSuccessfulSubmit={onSuccessfulSubmit}
            >
              <ObjectMapper
                pointer="#"
                uiSchema={UISchema}
                formFields={formFields}
                defaultValues={selectedValues}
              />
              <FormSubmit label="Submit" />
            </FormHandler>
          )
        }
        return (
          <FormHandler
            schema={customPriceSchema}
            formProps={props}
            onSuccessfulSubmit={onSuccessfulSubmit}
          >
            {props.children}
          </FormHandler>
        )
      }}
    </ToastConsumer>
  )
}

OrderConfigurationForm.defaultProps = {
  onSuccessfulSubmit: () => {
    window.location.reload()
  },
}

export default OrderConfigurationForm
