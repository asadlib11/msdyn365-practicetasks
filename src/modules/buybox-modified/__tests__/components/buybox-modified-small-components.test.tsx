/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { render } from 'enzyme';
import * as React from 'react';

import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { AsyncResult, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { IBuyboxModifiedData, IBuyboxModifiedProps } from '../../../../index';
import { mockResources } from '../../__mocks__/mock-resources';
import { IBuyboxCallbacks, IBuyboxState } from '../../buybox-modified';
import {
    BuyboxErrorBlock,
    getBuyboxProductDescription,
    getBuyboxProductQuantity,
    getBuyboxProductTitle,
    IBuyboxErrorBlockProps
} from '../../components';

// @ts-ignore partial mock
const mockContext: ICoreContext<{}>  = {
    app: {
        config: {
            maxQuantityForCartLineItem: 5
        }
    }
};

describe('Buybox Product Title', () => {
    let moduleProps: IBuyboxModifiedProps<IBuyboxModifiedData>;

    it('returns null if no product', () => {
        moduleProps = buildMockModuleProps(
            {
                product: {
                    status: 'FAILED',
                    result: undefined,
                } as AsyncResult<SimpleProduct>
            },
            {},
            {},
            mockContext
        ) as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const title = getBuyboxProductTitle(moduleProps);

        expect(title).toBe(undefined);
    });

    it('renders correctly with default values', () => {
        moduleProps = buildMockModuleProps(
            {
                product: {
                    status: 'SUCCESS',
                    result: {
                        Name: undefined
                    },
                } as AsyncResult<SimpleProduct>
            },
            {},
            {},
            mockContext
        ) as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const title = getBuyboxProductTitle(moduleProps);

        expect(title).toBeDefined();

        const component = render(title!);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly with supplied values', () => {
        moduleProps = buildMockModuleProps(
            {
                product: {
                    status: 'SUCCESS',
                    result: {
                        Name: 'Toy'
                    },
                } as AsyncResult<SimpleProduct>,
            },
            {},
            {
                titleHeadingTag: 'h2'
            },
            mockContext
        ) as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const title = getBuyboxProductTitle(moduleProps);

        expect(title).toBeDefined();

        const component = render(title!);
        expect(component).toMatchSnapshot();
    });
});

describe('getBuyboxProductDescription', () => {
    let moduleProps: IBuyboxModifiedProps<IBuyboxModifiedData>;

    it('returns null if no product', () => {
        moduleProps = buildMockModuleProps(
            {
                product: {
                    status: 'FAILED',
                    result: undefined,
                } as AsyncResult<SimpleProduct>
            },
            {},
            {},
            mockContext
        ) as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const description = getBuyboxProductDescription(moduleProps);

        expect(description).toBe(undefined);
    });

    it('renders correctly with default values', () => {
        moduleProps = buildMockModuleProps(
            {
                product: {
                    status: 'SUCCESS',
                    result: {
                        Name: undefined
                    },
                } as AsyncResult<SimpleProduct>
            },
            {},
            {},
            mockContext
        ) as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const description = getBuyboxProductDescription(moduleProps);

        expect(description).toBeDefined();

        const component = render(description!);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly with supplied values', () => {
        moduleProps = buildMockModuleProps(
            {
                product: {
                    status: 'SUCCESS',
                    result: {
                        Description: 'This is a toy'
                    },
                } as AsyncResult<SimpleProduct>,
            },
            {},
            {},
            mockContext
        ) as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const description = getBuyboxProductTitle(moduleProps);

        expect(description).toBeDefined();

        const component = render(description!);
        expect(component).toMatchSnapshot();
    });
});

describe('Buybox Product Quantity', () => {
    let moduleProps: IBuyboxModifiedProps<IBuyboxModifiedData>;

    const mockState: IBuyboxState = {
        quantity: 0,
        errorState: {
            configureErrors: {}
        },
        selectedDimensions: {}
    };

    const mockCallbacks: IBuyboxCallbacks = {
        updateQuantity: jest.fn(),
        updateErrorState: jest.fn(),
        dimensionSelectedAsync: jest.fn(),
        updateSelectedProduct: jest.fn(),
        getDropdownName: jest.fn()
    };

    it('does not include error block if no errors', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ),
            resources: mockResources
         } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const quantity = getBuyboxProductQuantity(moduleProps, mockState, mockCallbacks);

        expect(quantity.errors).toBeUndefined();
    });

    it('includes error block if no errors', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ),
            resources: mockResources
         } as IBuyboxModifiedProps<IBuyboxModifiedData>;
        const quantity = getBuyboxProductQuantity(moduleProps, mockState, mockCallbacks);

        expect(quantity.errors).toBeUndefined();
    });

    it('fires callback when input changes', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ),
            resources: mockResources
         } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const quantity = getBuyboxProductQuantity(moduleProps, mockState, mockCallbacks);

        // @ts-ignore
        const quantityProps: IQuantityProps = quantity.input.props;

        quantityProps.onChange(2);

        expect(mockCallbacks.updateQuantity).toBeCalledWith(2);
   });
});

describe('Buybox Error Block', () => {
    it('renders correctly with no error messages', () => {
        const mockProps: IBuyboxErrorBlockProps = {
            resources: mockResources,
            configureErrors: {},
            otherError: undefined,
            quantityError: undefined,
            showError: true
        };
        const component = render(<BuyboxErrorBlock {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly with errors', () => {
        const mockProps: IBuyboxErrorBlockProps = {
            resources: mockResources,
            configureErrors: {1: 'Missing 1', 2: 'Missing 2'},
            otherError: 'Other error',
            quantityError: 'Quantity error',
            showError: true
        };
        const component = render(<BuyboxErrorBlock {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly with errors but showError=false', () => {
        const mockProps: IBuyboxErrorBlockProps = {
            resources: mockResources,
            configureErrors: {1: 'Missing 1', 2: 'Missing 2'},
            otherError: 'Other error',
            quantityError: 'Quantity error',
            showError: false
        };
        const component = render(<BuyboxErrorBlock {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});