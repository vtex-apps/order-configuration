import React from 'react'
import { contains, has, mergeRight, omit, pathOr } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { UITypes } from 'react-hook-form-jsonschema'

import { CustomPriceSelectorProps } from './typings/FormProps'
import { TOAST_DURATION_MS } from './utils/toast'
import { ObjectMapper } from './components/Object'
import { FormHandler } from './components/FormHandler'
import FormSubmit from './FormSubmit'
import { useOrderConfiguration } from './OrderConfigurationContext'
import { ToastConsumer } from 'vtex.styleguide'
import { ToastRenderProps } from './typings/global'

const OrderConfigurationForm: StorefrontFunctionComponent<
  CustomPriceSelectorProps
> = props => {
  const { customSessionData, profileData } = useOrderConfiguration()

  const defaultValues = omit(
    ['email'],
    JSON.parse(
      pathOr(
        '{}',
        ['getCustomSessionKeys', 'customSessionKeys'],
        customSessionData
      )
    )
  )

  const { formFields = [] } = props
  const email = pathOr(null, ['profile', 'email'], profileData)
  let customPriceSchema: {
    type: string
    properties: any
    required: string[]
  } = {
    type: 'object',
    properties: {},
    required: [],
  }

  let UISchema = {
    type: UITypes.default,
    properties: {},
  }
  formFields.map(formField => {
    let fieldProps: any = {
      type: pathOr('string', ['type'], formField),
      title: pathOr(formField.name, ['label'], formField),
    }
    if (
      contains(pathOr('text', ['fieldType'], formField), ['select', 'radio'])
    ) {
      fieldProps = {
        ...fieldProps,
        enum: pathOr([], ['options'], formField).map(
          (option: { value: string }) => option.value
        ),
      }
    }
    if (has('format', formField)) {
      fieldProps = {
        ...fieldProps,
        format: pathOr('', ['format'], formField),
      }
    }
    const properties = {
      ...customPriceSchema.properties,
      [formField.name]: fieldProps,
    }

    let required: string[] = customPriceSchema.required
    if (pathOr<boolean>(false, ['required'], formField) == true) {
      required = [...required, formField.name]
    }
    customPriceSchema = mergeRight(customPriceSchema, {
      properties: properties,
      required: required,
    })

    let uiProps
    switch (
      pathOr<'text' | 'select' | 'radio' | 'checkbox'>(
        'text',
        ['fieldType'],
        formField
      )
    ) {
      case 'select':
        uiProps = {
          type: UITypes.select,
        }
        break
      case 'radio':
        uiProps = {
          type: UITypes.radio,
        }
        break
      case 'checkbox':
        uiProps = {
          type: UITypes.checkbox,
        }
        break
      case 'text':
      default:
        uiProps = {
          type: UITypes.input,
        }
        break
    }
    const UISchemaProps = {
      ...UISchema.properties,
      [formField.name]: uiProps,
    }
    UISchema = mergeRight(UISchema, {
      properties: UISchemaProps,
    })
  })

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
        return (
          <FormHandler
            schema={customPriceSchema}
            formProps={props}
            email={email}
            onSuccessfulSubmit={onSuccessfulSubmit}
          >
            <ObjectMapper
              pointer="#"
              uiSchema={UISchema}
              formFields={formFields}
              defaultValues={defaultValues}
            />
            <FormSubmit label="Submit" />
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

OrderConfigurationForm.schema = {
  title: 'admin/editor.custom-price-selector.title',
  description: 'admin/editor.custom-price-selector.description',
  type: 'object',
  properties: {
    formTitle: {
      title: 'admin/editor.custom-price-selector.formTitle.title',
      type: 'string',
      default: 'Order Configuration',
    },
    formFields: {
      title: 'admin/editor.custom-price-selector.formFields.title',
      type: 'array',
      items: {
        title: 'admin/editor.custom-price-selector.formFields.title',
        type: 'object',
        properties: {
          name: {
            title: 'admin/editor.custom-price-selector.formFields.name',
            type: 'string',
          },
          type: {
            title: 'admin/editor.custom-price-selector.formFields.type',
            type: 'string',
            enum: ['string', 'number'],
            enumNames: ['String', 'Number'],
            widget: {
              'ui:widget': 'radio',
            },
            default: 'string',
          },
          fieldType: {
            title: 'admin/editor.custom-price-selector.formFields.fieldType',
            type: 'string',
            enum: ['text', 'textarea', 'select', 'radio', 'checkbox'],
            enumNames: ['Text', 'Textarea', 'Select', 'Radio', 'Checkbox'],
            default: 'text',
          },
          label: {
            title: 'admin/editor.custom-price-selector.formFields.label',
            type: 'string',
          },
          required: {
            title: 'admin/editor.custom-price-selector.formFields.required',
            type: 'boolean',
          },
          format: {
            title: 'admin/editor.custom-price-selector.formFields.format',
            type: 'string',
            // required: false
          },
          options: {
            title: 'admin/editor.custom-price-selector.formFields.options',
            description:
              'admin/editor.custom-price-selector.formFields.options.description',
            type: 'array',
            items: {
              title: 'admin/editor.custom-price-selector.formFields.options',
              type: 'object',
              properties: {
                label: {
                  title:
                    'admin/editor.custom-price-selector.formFields.options.label',
                  type: 'string',
                },
                value: {
                  title:
                    'admin/editor.custom-price-selector.formFields.options.value',
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
}

export default OrderConfigurationForm
