import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { UITypes } from 'react-hook-form-jsonschema'
import { Button, Modal } from 'vtex.styleguide'

import { ObjectMapper } from './components/Object'
import { FormHandler } from './components/FormHandler'
import FormSubmit from './FormSubmit'

import getCustomPriceSchema from './queries/getCustomPriceSchema.graphql'
import getCustomSessionKeys from './queries/getCustomSessionKeys.graphql'

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

  const [isModalOpen, setModalOpen] = useState(false)

  console.log(customSessionLoading)
  console.log(customSessionData)

  if (customSessionLoading || customPriceSchemaLoading) {
    return <div>Loading...</div>
  }

  // let customPriceSchema = customPriceSchemaData.customPriceSchema.schema
  const customPriceSchema = {
    type: 'object',
    properties: {
      orderType: {
        type: 'string',
        enum: ['Type 1', 'Type 2'],
        title: 'Order Type',
      }
    }
  }

  const { children } = props

  const UISchema = {
    type: UITypes.default,
    properties: {
      orderType: {
        type: UITypes.select,
        items: [
          {type3: 'Type 3'},
          {type4: 'Type 4'}
        ]
      },
    },
  }

  return (
    <div className="tc">
      <div>
        <Button onClick={() => setModalOpen(!isModalOpen)}>
          {props.formTitle}
        </Button>

        <Modal
          centered
          isOpen={isModalOpen}
          onClose={() => setModalOpen(!isModalOpen)}
        >
          <div className="flex flex-column flex-row-ns">
            <div className="w-100 mv4 pv6-ns pl6-ns">
              {!React.Children.count(children) ? (
                <FormHandler schema={customPriceSchema} formProps={props}>
                  <ObjectMapper pointer="#" uiSchema={UISchema} />
                  <FormSubmit label="Submit" />
                </FormHandler>
              ) : (
                <FormHandler schema={customPriceSchema} formProps={props}>
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

type CustomPriceSelectorProps = {
  formTitle: string
}

CustomPriceSelector.schema = {
  title: 'editor.custom-price-selector.title',
  description: 'editor.custom-price-selector.description',
  type: 'object',
  properties: {
    formTitle: {
      title: 'editor.custom-price-selector.formTitle.title',
      type: 'string',
      default: 'Order Configuration',
    },
  },
}

export default CustomPriceSelector
