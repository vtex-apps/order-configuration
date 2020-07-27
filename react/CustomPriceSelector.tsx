import React from 'react'
import { useQuery } from 'react-apollo'
import { omit, pathOr } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'

import getCustomSessionKeys from './queries/getCustomSessionKeys.graphql'
import getProfile from './queries/getProfile.graphql'
import { OrderConfigurationContextProvider } from './OrderConfigurationContext'
import { FormField } from './typings/FormProps'

const CSS_HANDLES = ['loader'] as const

type Props = {
  formFields: FormField[]
  children: any
}

const CustomPriceSelector: StorefrontFunctionComponent<Props> = props => {
  const { data: customSessionData, loading: customSessionLoading } = useQuery(
    getCustomSessionKeys,
    {
      ssr: false,
    }
  )

  const { data: profileData, loading: profileLoading } = useQuery(getProfile)

  const handles = useCssHandles(CSS_HANDLES)

  if (profileLoading || customSessionLoading) {
    return (
      <div className={`h-100 flex items-center ${handles.loader}`}>
        Loading...
      </div>
    )
  }

  const selectedValues = omit(
    ['email'],
    JSON.parse(
      pathOr(
        '{}',
        ['getCustomSessionKeys', 'customSessionKeys'],
        customSessionData
      )
    )
  )

  return (
    <OrderConfigurationContextProvider
      selectedValues={selectedValues}
      profileData={profileData}
      formFields={props.formFields}
    >
      {props.children}
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

export default CustomPriceSelector
