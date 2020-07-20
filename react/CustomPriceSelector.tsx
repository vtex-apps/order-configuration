import React, { useState } from 'react'
import { contains, has, values, mergeRight, omit, pathOr } from 'ramda'
import { useQuery } from 'react-apollo'
import { UITypes } from 'react-hook-form-jsonschema'
import { ButtonWithIcon, IconEdit, Modal } from 'vtex.styleguide'

import { ObjectMapper } from './components/Object'
import { FormHandler } from './components/FormHandler'
import FormSubmit from './FormSubmit'
import { CustomPriceSelectorProps } from './typings/FormProps'
import { toSentenceCase } from './utils/string'

import getCustomPriceSchema from './queries/getCustomPriceSchema.graphql'
import getCustomSessionKeys from './queries/getCustomSessionKeys.graphql'
import getProfile from './queries/getProfile.graphql'

const CustomPriceSelector: StorefrontFunctionComponent<
  CustomPriceSelectorProps
> = props => {
  const { data: customSessionData, loading: customSessionLoading } = useQuery(
    getCustomSessionKeys,
    {
      ssr: false,
    }
  )

  const {
    // data: customPriceSchemaData,
    loading: customPriceSchemaLoading,
  } = useQuery(getCustomPriceSchema, {
    ssr: false,
  })

  const { data: profileData, loading: profileLoading } = useQuery(getProfile)

  const [isModalOpen, setModalOpen] = useState(false)

  if (profileLoading || customSessionLoading || customPriceSchemaLoading) {
    return <div>Loading...</div>
  }

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

  const { children, formFields } = props
  const email = pathOr('', ['profile', 'email'], profileData)
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
    <div className="tc">
      <div className="h-100">
        <div className="h-100 flex items-center">
          <span className="mr4">{props.formTitle}</span>
          <span className="mr4 fw6">
            {values(defaultValues)
              .map(val => toSentenceCase(val, '_'))
              .join(', ')}
          </span>
          <ButtonWithIcon
            icon={<IconEdit />}
            iconPosition="right"
            variation="secondary"
            onClick={() => setModalOpen(!isModalOpen)}
          />
        </div>

        <Modal
          centered
          isOpen={isModalOpen}
          onClose={() => setModalOpen(!isModalOpen)}
          title={pathOr('Order Configuration', ['formTitle'], props)}
        >
          <div className="flex flex-column flex-row-ns">
            <div className="w-100 mv4 pv6-ns pl6-ns">
              {!React.Children.count(children) ? (
                <FormHandler
                  schema={customPriceSchema}
                  formProps={props}
                  email={email}
                >
                  <ObjectMapper
                    pointer="#"
                    uiSchema={UISchema}
                    formFields={formFields}
                    defaultValues={defaultValues}
                  />
                  <FormSubmit label="Submit" />
                </FormHandler>
              ) : (
                <FormHandler
                  schema={customPriceSchema}
                  formProps={props}
                  email={email}
                >
                  {children}
                </FormHandler>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

CustomPriceSelector.defaultProps = {
  formTitle: 'Order Configuration'
}

CustomPriceSelector.schema = {
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
            type: 'string'
          },
          type: {
            title: 'admin/editor.custom-price-selector.formFields.type',
            type: 'string',
            enum: ['string', 'number'],
            enumNames: ['String', 'Number'],
            widget: {
              "ui:widget": "radio"
            },
            default: 'string'
          },
          fieldType: {
            title: 'admin/editor.custom-price-selector.formFields.fieldType',
            type: 'string',
            enum: ['text', 'textarea', 'select', 'radio', 'checkbox'],
            enumNames: ['Text', 'Textarea', 'Select', 'Radio', 'Checkbox'],
            default: 'text'
          },
          label: {
            title: 'admin/editor.custom-price-selector.formFields.label',
            type: 'string'
          },
          required: {
            title: 'admin/editor.custom-price-selector.formFields.required',
            type: 'boolean'
          },
          format: {
            title: 'admin/editor.custom-price-selector.formFields.format',
            type: 'string',
            // required: false
          },
          options: {
            title: 'admin/editor.custom-price-selector.formFields.options',
            description: 'admin/editor.custom-price-selector.formFields.options.description',
            type: 'array',
            items: {
              title: 'admin/editor.custom-price-selector.formFields.options',
              type: 'object',
              properties: {
                label: {
                  title: 'admin/editor.custom-price-selector.formFields.options.label',
                  type: 'string'
                },
                value: {
                  title: 'admin/editor.custom-price-selector.formFields.options.value',
                  type: 'string'
                },
              }
            }
          }
        }
      }
    }
  },
}

export default CustomPriceSelector
