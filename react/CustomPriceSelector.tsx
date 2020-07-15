import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
// import { useInput, FormContext } from 'react-hook-form-jsonschema'
import { Button, ModalDialog, RadioGroup } from 'vtex.styleguide'

import getCustomSessionKeys from './queries/getCustomSessionKeys.graphql'

const CustomPriceSelector: StorefrontFunctionComponent<
  CustomPriceSelectorProps
> = ({ formTitle = 'Order Configuration' }) => {
  const { data, loading } = useQuery(getCustomSessionKeys, {
    // variables: {
    //   query: searchTerm
    // },
    ssr: false,
  })

  const [isModalOpen, setModalOpen] = useState(false)
  const [orderType, setOrderType] = useState('resale')
  // const [paymentMethod, setPaymentMethod] = useState('promissory_note')
  // const [paymentTerm, setPaymentTerm] = useState('30/60')

  console.log(formTitle)
  console.log(data)

  // const configSchema = {
  //   // $id: 'https://example.com/config.schema.json',
  //   // $schema: 'http://json-schema.org/draft-07/schema#',
  //   // title: 'Order Configuration',
  //   // type: 'object',
  //   properties: {
  //     orderType: {
  //       type: 'string',
  //       description: 'Type of order',
  //     },
  //   },
  // }

  // const orderTypeInput = useInput('#/properties/orderType')

  return (
    <div className="tc">
      {!loading && (
        <div>
          <Button onClick={() => setModalOpen(!isModalOpen)}>
            {formTitle}
          </Button>

          <ModalDialog
            centered
            confirmation={{
              onClick: () => setModalOpen(!isModalOpen),
              label: 'Send',
            }}
            cancelation={{
              onClick: () => setModalOpen(!isModalOpen),
              label: 'Cancel',
            }}
            isOpen={isModalOpen}
            onClose={() => setModalOpen(!isModalOpen)}
          >
            {/* <FormContext schema={configSchema}> */}
            <div className="flex flex-column flex-row-ns">
              <div className="w-100 mv4 pv6-ns pl6-ns">
                <div className="w-100 mv6">
                  <RadioGroup
                    // error={state.error}
                    // errorMessage={state.error && state.errorMessage}
                    name="orderType"
                    options={[
                      { value: 'resale', label: 'Resale' },
                      { value: 'consumption', label: 'Consumption' },
                      { value: 'industrialization', label: 'Industrialization' },
                    ]}
                    value={orderType}
                    onChange={({ target: { value } }: { target: { value: string } }) =>
                      setOrderType(value)
                    }
                  />
                  {/* <label {...orderTypeInput.getLabelProps()}>
                      {orderTypeInput.name}
                    </label>
                    <input {...orderTypeInput.getInputProps()} /> */}
                </div>
                {/* <div className="w-100 mv6">
                <Input placeholder="Last name" size="large" />
              </div>
              <div className="w-100 mv6">
                <Input placeholder="Corporate email" size="large" />
              </div>
              <div className="w-100 mv6">
                <Input placeholder="Company" size="large" />
              </div>
              <div className="w-100 mv6">
                <Input placeholder="Annual revenue" size="large" />
              </div>
              <div className="w-100 mv6">
                <Input placeholder="Do you have e-commerce?" size="large" />
              </div> */}
              </div>
            </div>
            {/* </FormContext> */}
          </ModalDialog>
        </div>
      )}
    </div>
  )
}

interface CustomPriceSelectorProps {
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
