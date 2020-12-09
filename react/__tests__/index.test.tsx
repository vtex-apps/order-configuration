import React from 'react'
import { render } from '@vtex/test-tools/react'
import OrderConfigurationSelector from '../OrderConfigurationSelector'
import { ApolloProvider } from '@apollo/react-common'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'unfetch'

const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://localhost:3000', fetch }),
  cache: new InMemoryCache(),
})

describe('CustomPriceSelector Component', () => {
  it('should render Loading', () => {
    const { getByText } = render(
      <ApolloProvider client={client}>
        <OrderConfigurationSelector formFields={[]} />
      </ApolloProvider>
    )

    expect(getByText(/Loading/)).toBeDefined()
  })
})
