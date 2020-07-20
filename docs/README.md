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
| `custom-price-selector` | Renders the selected order configuration alongwith a form to update it. |

2. In the header for example, add the `custom-price-selector` block.

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
+     "custom-price-selector",
      "vtex.menu@2.x:menu#institutional"
    ]
  },
```

3.  Then, declare the `custom-price-selector` block.

```JSON
{
  "custom-price-selector": {
    "props": {
      "formFields": [
        {
          "name": "orderType",
          "type": "string",
          "fieldType": "radio",
          "label": "Order Type",
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
          "name": "paymentMethod",
          "type": "string",
          "fieldType": "select",
          "label": "Payment Method",
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
        }
      ]
    }
  },
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
| `title` | 
| `titleValues` |
