import React from 'react'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'

import orderConfiguration from './queries/orderConfiguration.graphql'
import { OrderConfigurationContextProvider } from './OrderConfigurationContext'
import { FormField } from './typings/FormProps'
import { fromFieldArrayFormat } from './logic/fromFieldArrayFormat'

const CSS_HANDLES = ['loader', 'wrapper'] as const

interface Props {
  formFields: FormField[]
}

const OrderConfigurationSelector: StorefrontFunctionComponent<Props> = props => {
  const { data, loading } = useQuery(orderConfiguration, {
    ssr: false,
  })
  const orderConfigurationFields =
    data && data.orderConfiguration && data.orderConfiguration.fields
  const orderConfigurationLoading = loading

  const handles = useCssHandles(CSS_HANDLES)

  if (orderConfigurationLoading) {
    return (
      <div className={`h-100 flex items-center ${handles.loader}`}>
        Loading...
      </div>
    )
  }

  const selectedValues = orderConfigurationFields
    ? fromFieldArrayFormat(orderConfigurationFields)
    : {}

  return (
    <OrderConfigurationContextProvider
      selectedValues={selectedValues}
      formFields={props.formFields}
    >
      <div className={`mw9 center flex flex-column ${handles.wrapper}`}>
        {props.children}
      </div>
    </OrderConfigurationContextProvider>
  )
}

OrderConfigurationSelector.schema = {
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
          showInTitle: {
            title: 'admin/editor.custom-price-selector.formFields.showInTitle',
            type: 'boolean',
            default: false,
          },
          format: {
            title: 'admin/editor.custom-price-selector.formFields.format',
            type: 'string',
            enum: ['', 'email', 'date-time', 'hostname', 'ipv4', 'ipv6', 'uri'],
            enumNames: [
              'Not specified',
              'Email',
              'Date/time in ISO format',
              'Internet host name',
              'IPv4 address',
              'IPv6 address',
              'A universal resource identifier',
            ],
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

export default OrderConfigurationSelector
