interface CheckoutAddress {
  addressType: string
  receiverName: string | null
  addressId: string
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number: string
  neighborhood: string
  complement: string
  reference: string | null
  geoCoordinates: [number, number]
}
