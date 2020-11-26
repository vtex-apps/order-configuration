import React from 'react'
import { useQuery } from 'react-apollo'
import { pathOr } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'

import CUSTOM_SESSION_KEYS_QUERY from './queries/customSessionKeys.graphql'
import PROFILE_QUERY from './queries/profile.graphql'
import { OrderConfigurationContextProvider } from './OrderConfigurationContext'
import { FormField } from './typings/FormProps'

const CSS_HANDLES = ['loader', 'wrapper'] as const

type Props = {
  formFields: FormField[]
  children: any
}

const CustomPriceSelector: StorefrontFunctionComponent<Props> = props => {
  const { data: customSessionKeys, loading: customSessionLoading } = useQuery(
    CUSTOM_SESSION_KEYS_QUERY,
    {
      ssr: false,
    }
  )

  const { data: profileData, loading: profileLoading } = useQuery(PROFILE_QUERY)

  const handles = useCssHandles(CSS_HANDLES)

  if (profileLoading || customSessionLoading) {
    return (
      <div className={`h-100 flex items-center ${handles.loader}`}>
        Loading...
      </div>
    )
  }

  const selectedValues = JSON.parse(
    pathOr('{}', ['customSessionKeys'], customSessionKeys)
  )

  return (
    <OrderConfigurationContextProvider
      selectedValues={selectedValues}
      profileData={profileData}
      formFields={props.formFields}
    >
      <div className={`mw9 center flex flex-column ${handles.wrapper}`}>
        {props.children}
      </div>
    </OrderConfigurationContextProvider>
  )
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

export default CustomPriceSelector
