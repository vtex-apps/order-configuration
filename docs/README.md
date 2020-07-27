# Custom Price Selector for B2B Users

This component allows a B2B user to select a pricing profile.

## Configuration

:warning: Keep in mind not to add an input for the user's `email`, as the email is collected from the user profile.

1. Add `custom-price-selector` app to your theme's dependencies in the `manifest.json`, for example:

```JSON
dependencies: {
  "b2bstore.custom-price-selector": "0.x"
}
```

Now, you are able to use the blocks exported by the `custom-price-selector` app. Check out the full list below:

| Block name     | Description                                     |
| -------------- | ----------------------------------------------- |
| `order-config` | Renders the selected order configuration alongwith a form to update it |
| `order-config.title` | Renders the selected order configuration values |
| `order-config.modal` | Renders the blocks in a modal |
| `order-config.form` | Renders the order configuration form content |

2. In the header for example, add the `order-config` block.

```JSON
{
  "header-layout.desktop": {
    "children": [
      "flex-layout.row#1-desktop",
      "flex-layout.row#2-desktop",
+     "flex-layout.row#3-desktop",
      "sticky-layout#4-desktop"
    ]
  },
 "flex-layout.row#3-desktop": {
    "props": {
      "blockClass": "menu-link",
      "horizontalAlign": "center",
      "preventHorizontalStretch": true,
      "preventVerticalStretch": true,
      "fullWidth": true
    },
    "children": [
      "vtex.menu@2.x:menu#websites",
      "flex-layout.col#spacer",
+     "order-config#header",
      "vtex.menu@2.x:menu#institutional"
    ]
  },
```

3.  Then, declare the `order-config#header` block.

```JSON
{
  "order-config#header": {
    "children": [
      "order-config.title#header",
      "order-config.modal#header"
    ],
    "props": {
      "blockClass": "header",
      "formFields": [
        {
          "name": "orderType",
          "type": "string",
          "fieldType": "radio",
          "label": "Order Type",
          "defaultValue": "resale",
          "options": [
            {
              "label": "Resale",
              "value": "resale"
            },
            {
              "label": "Consumption",
              "value": "consumption"
            }
          ]
        },
        {
          "name": "state",
          "type": "string",
          "fieldType": "select",
          "label": "State",
          "showInTitle": true,
          "options": [
            {
              "label": "ES",
              "value": "ES"
            },
            {
              "label": "SP",
              "value": "SP"
            }
          ]
        }
      ]
    }
  },
  "order-config.modal#header": {
    "children": [
      "order-config.form"
    ]
  },
  "order-config.title#header": {
    "props": {
      "formTitle": "Order Configuration for Header"
    }
  },
}
```

:information_source: If the <code>form</code> block does not have any children configured, <strong>a default form will be rendered</strong> automatically based on the JSON schema in Master Data. This reading and interpretation of  JSON schemas is due to the <a href="[https://github.com/vtex/react-hook-form-jsonschema)](https://github.com/vtex/react-hook-form-jsonschema))">Reacht Hook Form JSON Schema</a> library (which is supporting the Store Form blocks logic behind the scenes).

4. If desired,  complete the `order-config.form` block by adding and configuring an array of children blocks. For example:

```JSON
{
  "order-config#static-page": {
    "props": {
      "formFields": [
        {
          "name": "paymentMethod",
          "type": "string",
          "fieldType": "select",
          "label": "Payment Method",
          "defaultValue": "promissory_note",
          "showInTitle": true,
          "options": [
            {
              "label": "Promissory Note",
              "value": "promissory_note"
            },
            {
              "label": "Credit Card",
              "value": "credit_card"
            }
          ]
        },
        {
          "name": "state",
          "type": "string",
          "fieldType": "select",
          "label": "State",
          "showInTitle": true,
          "required": true,
          "options": [
            {
              "label": "ES",
              "value": "ES"
            },
            {
              "label": "SP",
              "value": "SP"
            }
          ]
        },
        {
          "name": "someTextInput",
          "label": "Some Text Input",
          "fieldType": "input",
          "type": "string",
          "required": true,
          "showInTitle": true
        }
      ]
    },
    "children": [
      "order-config.title#static-page",
      "order-config.form#static-page"
    ]
  },
  "order-config.form#static-page": {
    "children": [
      "flex-layout.row#state-and-payment-method",
      "order-config.text#some-text-input",
      "order-config.submit"
    ]
  },
  "flex-layout.row#state-and-payment-method": {
    "children": [
      "order-config.dropdown#state",
      "order-config.radiogroup#payment-method"
    ],
    "props": {
      "blockClass": "stateAndPaymentMethod"
    }
  },
  "order-config.dropdown#state": {
    "props": {
      "pointer": "#/properties/state"
    }
  },
  "order-config.radiogroup#payment-method": {
    "props": {
      "pointer": "#/properties/paymentMethod"
    }
  },
  "order-config.text#some-text-input": {
    "props": {
      "pointer": "#/properties/someTextInput"
    }
  },
  "order-config.title#static-page": {
    "props": {
      "formTitle": "Order Configuration for Static Page"
    }
  }
}
```

| Prop name | Type | Description                                                                                                                                         | Default Value |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `formFields`  | `array` | An array of form field definitions             | `undefined`              | 

### `formFields` props

| Prop name | Type | Description                                                                                                                                                                                                                                          | Default Value  |
| --------| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `name` | `string` |  Field input name | `undefined`              |
| `type` | `string` |  Field value type (`string` or `number`) | `string`              |
| `fieldType` | `string` |  Field input type (`text`, `textarea`, `select`, `radio` or `checkbox`) | `text`              |
| `label` | `string` |  Field label | Field's name  |
| `showInTitle` | `boolean` |  Whether to show the field value in the title | `false`  |
| `options` | `array` |  Field options in case of `select`, `radio` or `checkbox` | `undefined`  |

### `options` props

| Prop name   | Type                                 | Description                                                                                                                                                                                                                                      | Default Value |
| ----------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `label`   | `string`    | Option label | `undefined`              |
| `value` | `string` | Option value                 | `undefined`           |

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles |
| ----------- | 
| `loader` | 
| `wrapper` | 
| `title` | 
| `titleValues` |
| `titleWrapper` |
| `orderConfigFormWrapper` |
| `formSubmitContainer` |
| `formSubmitButton` |
| `formErrorServer` |
| `formErrorUserInput` |
| `orderConfigFormWrapper` |
