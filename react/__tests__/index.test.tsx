import React from 'react'
import { render } from '@vtex/test-tools/react'
import CustomPriceSelector from '../CustomPriceSelector'

describe('CustomPriceSelector Component', () => {
  it('should render the custom price selector', () => {
    const { getByText } = render(<CustomPriceSelector />)

    expect(getByText(/Order Configuration/)).toBeDefined()
  })

  it('should render title passed as props', () => {
    const { getByText } = render(<CustomPriceSelector title="foo" />)

    expect(getByText(/foo/)).toBeDefined()
  })
})
