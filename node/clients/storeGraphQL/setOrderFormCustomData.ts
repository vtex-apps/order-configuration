export const mutation = `
mutation setOrderFormCustomData ($appId: String, $field: String, $value: String) {
  setOrderFormCustomData(appId: $appId, field: $field, value: $value) {
    orderFormId
    customData {
      customApps {
        fields
        id
        major
      }
    }
  }
}
`;

export interface MutationReturnType {
  orderFormId: string;
  customData: {
    customApps: {
      fields: string;
      id: string;
      major: number;
    };
  }[];
}
