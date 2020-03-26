/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProductDimensionFull } from '@msdyn365-commerce/commerce-entities';
import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { AsyncResult, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { IBuyboxCallbacks, IBuyboxModifiedData, IBuyboxModifiedProps, IBuyboxState } from '../../../../index';
import { mockResources } from '../../__mocks__/mock-resources';
import { getBuyboxProductConfigure } from '../../components';

const mockDimensions = [
    {
        DimensionTypeValue: 3,
        DimensionValues: [{
                RecordId:22565421223,
                Value:'32',
                ExtensionProperties:[]
              },{
                RecordId:22565421225,
                Value:'36',
                ExtensionProperties:[]
              },{
                RecordId:22565421226,
                Value:'38',
                ExtensionProperties:[]
              },{
                RecordId:22565421227,
                Value:'40',
                ExtensionProperties:[]
              },{
                RecordId:22565421228,
                Value:'42',
                ExtensionProperties:[]
              },{
                RecordId:22565421229,
                Value:'44',
                ExtensionProperties:[]
              },{
                RecordId:22565421230,
                Value:'46',
                ExtensionProperties:[]
              },{
                RecordId:22565421231,
                Value:'48',
                ExtensionProperties:[]
              }
        ]
    },
    {
        DimensionTypeValue: 1,
        DimensionValues: [
            {
                RecordId:22565421201,
                Value: 'Light Blue',
                ExtensionProperties:[]
            }
        ]
    },
    {
        DimensionTypeValue: 4,
        DimensionValues: [{
                RecordId:5637144584,
                Value: 'Big',
                ExtensionProperties:[]
            },{
                RecordId:5637144583,
                Value:'Regular',
                ExtensionProperties:[]
            }
        ]
    },
    {
        DimensionTypeValue: 2,
        DimensionValues: [{
            RecordId:56371445841,
            ExtensionProperties:[]
        },{
            RecordId:56371445831,
            ExtensionProperties:[]
        }
    ]
    },
    {
        DimensionTypeValue: 5
    }
];

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

describe('Buybox Product Configure', () => {
    let moduleProps: IBuyboxModifiedProps<IBuyboxModifiedData>;

    beforeEach(() => {
        mockCallbacks.getDropdownName = jest.fn().mockReturnValue('Dimension');

        mockCallbacks.dimensionSelectedAsync = jest.fn();
    });

    it('Returns undefined when no product or dimensions present', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    product: {
                        status: 'FAILED',
                        result: undefined
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'FAILED',
                        result: undefined,
                    } as AsyncResult<ProductDimensionFull[]>,                },
                {},
                {}
            ),
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;
        const configure = getBuyboxProductConfigure(moduleProps, mockState, mockCallbacks);
        expect(configure).toBeUndefined();
    });

    it('Returns undefined when dimensions list is empty', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: [] as ProductDimensionFull[],
                    } as AsyncResult<ProductDimensionFull[]>,                },
                {},
                {}
            ),
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;
        const configure = getBuyboxProductConfigure(moduleProps, mockState, mockCallbacks);
        expect(configure).toBeUndefined();
    });

    it('Returns expected results when dimensions list is not empty', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: mockDimensions,
                    } as AsyncResult<ProductDimensionFull[]>,                },
                {},
                {}
            ),
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;
        const configure = getBuyboxProductConfigure(moduleProps, mockState, mockCallbacks);
        expect(configure).not.toBeUndefined();
        expect(configure!.dropdowns.length).toBe(5);
    });

    it('Returns errors if the right errors are set', () => {
        const mockStateWithErrors = {
            ...mockState,
            errorState: {
                configureErrors: {
                    1: 'Error for 1'
                }
            },
        };

        moduleProps = {
            ...buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: mockDimensions,
                    } as AsyncResult<ProductDimensionFull[]>,                },
                {},
                {}
            ),
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;
        const configure = getBuyboxProductConfigure(moduleProps, mockStateWithErrors, mockCallbacks);
        expect(configure).not.toBeUndefined();
        expect(configure!.dropdowns.length).toBe(5);
        expect(configure!.dropdowns[1].errors).toBeDefined();
    });

    it('Calls dimensionSelectedAsync when dimension value changes', async () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: mockDimensions,
                    } as AsyncResult<ProductDimensionFull[]>,                },
                {},
                {}
            ),
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;
        const configure = getBuyboxProductConfigure(moduleProps, mockState, mockCallbacks);
        expect(configure).not.toBeUndefined();
        expect(configure!.dropdowns.length).toBe(5);
        // @ts-ignore
        const dropdownProps = configure!.dropdowns[0].select.props;
        expect(dropdownProps.onChange).toBeDefined();

        await dropdownProps.onChange!({
            dropdownId: '3',
            selectId: '1',
            selectedValue: '36'
        });

        expect(mockCallbacks.dimensionSelectedAsync).toBeCalled();
    });

    /*
    it('properly responds to onChanged events when dimension value changes amd getSelectedVariant returns', async () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: mockDimensions,
                    } as AsyncResult<ProductDimensionFull[]>,                },
                {},
                {}
            ),
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;
        const configure = getBuyboxProductConfigure(moduleProps, mockState, mockCallbacks);
        expect(configure).not.toBeUndefined();
        expect(configure!.dropdowns.length).toBe(5);
        // @ts-ignore
        const dropdownProps = configure!.dropdowns[0].select.props;
        expect(dropdownProps.onChange).toBeDefined();

        // @ts-ignore
        RetailActions.getSelectedVariant = jest.fn().mockResolvedValue({RecordId: '10'});
        // @ts-ignore
        RetailActions.getDimensionsForSelectedVariant = jest.fn().mockResolvedValue(undefined);

        await dropdownProps.onChange!({
            dropdownId: '3',
            selectId: '1',
            selectedValue: '36'
        });

        expect(RetailActions.getSelectedVariant).toBeCalled();
        expect(RetailActions.getDimensionsForSelectedVariant).toBeCalled();
    });
    */
});