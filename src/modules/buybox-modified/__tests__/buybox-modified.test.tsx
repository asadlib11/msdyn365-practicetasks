/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mount } from 'enzyme';
import * as React from 'react';

import { IStoreSelectorStateManager } from '@msdyn365-commerce-modules/bopis-utilities';
import * as RetailActions from '@msdyn365-commerce-modules/retail-actions';
import { ProductDimensionFull, RatingsSummary } from '@msdyn365-commerce/commerce-entities';
import { IAddToCartComponentProps } from '@msdyn365-commerce/components';
import { buildMockModuleProps, ICoreContext } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import { AsyncResult, CommerceList, ProductPrice, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { Buybox, IBuyboxModifiedData, IBuyboxModifiedProps } from '../../../index';
import { mockResources } from '../__mocks__/mock-resources';
import { IBuyboxCallbacks, IBuyboxState, IBuyboxViewProps } from '../buybox-modified';
import { getBuyboxProductConfigure } from '../components';

const mockData: IBuyboxModifiedData = {
    product: {
        status: 'FAILED',
        result: undefined,
    } as AsyncResult<SimpleProduct>,
    productDimensions: {
        status: 'FAILED',
        result: undefined,
    } as AsyncResult<ProductDimensionFull[]>,
    storeSelectorStateManager: {
        status: 'FAILED',
        result: undefined,
    } as AsyncResult<IStoreSelectorStateManager>,
    productPrice: {
        status: 'FAILED',
        result: undefined
    } as AsyncResult<ProductPrice>,
    ratingsSummary: {
        status: 'SUCCESS',
        result: undefined
    } as AsyncResult<RatingsSummary>,
    cart: {
        status: 'SUCCESS',
        result: undefined
    } as AsyncResult<ICartState>,
    wishlists: {
        status: 'FAILED',
        result: undefined
    } as AsyncResult<CommerceList[]>
};

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

// @ts-ignore partial mock
const mockContext: ICoreContext  = {
    app: {
        config: {
            maxQuantityForCartLineItem: 5
        }
    }
};

// @ts-ignore partial mock
const mockContextNoMaxQuantity: ICoreContext  = {
    app: {
        config: {
        }
    }
};

const mockSlots = {
    mediaGallery: [],
    storeSelector: [],
    textBlocks: []
};

describe('Buybox Module tests', () => {
    let moduleProps: IBuyboxModifiedProps<IBuyboxModifiedData>;

    beforeEach(() => {
        // @ts-ignore
        RetailActions.getSelectedVariant = jest.fn().mockResolvedValue(undefined);

        // @ts-ignore
        RetailActions.getDimensionsForSelectedVariant = jest.fn().mockResolvedValue(undefined);
    });

    it('Renders as expected when no product defined', () => {
        moduleProps = {
            ...buildMockModuleProps(mockData, {}, {}, mockContext) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
          };

        mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).not.toBeCalled();
    });

    it('Renders as expected when product defined but no media gallery present', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
          };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.mediaGallery).not.toBeTruthy();
    });

    it('Renders as expected when product defined and media gallery present', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: {...mockSlots,
                mediaGallery: [(<div>Media Gallery</div>)],
            },
            resources: mockResources
          };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.mediaGallery).toBeTruthy();
    });

    it('Renders as expected when product defined but no store selector state manager', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.title).toBeTruthy();
        expect(viewProps.description).toBeTruthy();
        expect(viewProps.findInStore).not.toBeTruthy();
    });

    it('Renders as expected when product defined and store selector state manager also defined but no store selector present', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<IStoreSelectorStateManager>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.title).toBeTruthy();
        expect(viewProps.description).toBeTruthy();
        expect(viewProps.findInStore).not.toBeTruthy();
    });

    it('Renders as expected when product defined and store selector state manager also defined and also store selector present', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<IStoreSelectorStateManager>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: {...mockSlots,
                storeSelector: [(<div>Store Selector</div>)]
            },
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.title).toBeTruthy();
        expect(viewProps.description).toBeTruthy();
        expect(viewProps.findInStore).toBeTruthy();
    });

    it('Renders as expected when productPrice is not defined', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: {...mockSlots,
                storeSelector: [(<div>Store Selector</div>)]
            },
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.title).toBeTruthy();
        expect(viewProps.description).toBeTruthy();
        expect(viewProps.addToCart).toBeTruthy();
        expect(viewProps.price).toBeFalsy();
    });

    it('Renders as expected when product and productDimensions are defined', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: [{DimensionTypeValue: 1}]
                    } as AsyncResult<ProductDimensionFull[]>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: {...mockSlots,
                storeSelector: [(<div>Store Selector</div>)]
            },
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.configure).toBeTruthy();
    });

    it('Renders as expected when productPrice is defined', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    productPrice: {
                        status: 'SUCCESS',
                        result: {
                            CustomerContextualPrice: 15
                        }
                    }
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: {...mockSlots,
                storeSelector: [(<div>Store Selector</div>)]
            },
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.title).toBeTruthy();
        expect(viewProps.description).toBeTruthy();
        expect(viewProps.addToCart).toBeTruthy();
        expect(viewProps.price).toBeTruthy();
    });

    it('Renders as expected when ratingSummary is not defined', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: {...mockSlots,
                storeSelector: [(<div>Store Selector</div>)]
            },
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.title).toBeTruthy();
        expect(viewProps.description).toBeTruthy();
        expect(viewProps.addToCart).toBeTruthy();
        expect(viewProps.price).not.toBeTruthy();
        expect(viewProps.rating).not.toBeTruthy();

    });

    it('Renders as expected when ratingSummary and product is defined', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    ratingsSummary: {
                        status: 'SUCCESS',
                        result: {
                            averageRating: 3.7,
                            reviewsCount: 1000
                        }
                    }
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: {...mockSlots,
                storeSelector: [(<div>Store Selector</div>)]
            },
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.title).toBeTruthy();
        expect(viewProps.description).toBeTruthy();
        expect(viewProps.addToCart).toBeTruthy();
        expect(viewProps.price).not.toBeTruthy();
        expect(viewProps.rating).toBeTruthy();
    });

    it('Renders add to wishlist as expected when product is defined', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();
        expect(viewProps.addToWishlist).toBeTruthy();
    });

    it('Renders quantity as expected', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },

                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.quantity).toBeTruthy();
    });

    it('When quantity updates, quantity in add to cart updates too', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const quantityProps: IQuantityProps = viewProps.quantity!.input.props;

        quantityProps.onChange(2);

        // @ts-ignore
        expect(result.state().quantity).toEqual(2);
    });

    it('When add to cart fails, properly updates state when add to cart fails with EMPTYINPUT', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'EMPTYINPUT'});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toEqual('Add to cart failed. Please refresh and retry');
        expect(state.errorState.configureErrors).toEqual({});
        expect(state.errorState.quantityError).toBeUndefined();
    });

    it('When add to cart fails, properly updates state when add to cart fails with CARTACTIONFAILED but not MAXQUANTITY', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'CARTACTIONFAILED'});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toEqual('Add to cart failed. Please refresh and retry');
        expect(state.errorState.configureErrors).toEqual({});
        expect(state.errorState.quantityError).toBeUndefined();
    });

    it('When add to cart fails, properly updates state when add to cart fails with CARTACTIONFAILED and result substatus MAXQUANTITY', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'CARTACTIONFAILED', cartActionResult: { status: 'FAILED', substatus: 'MAXQUANTITY'}});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toEqual('You can only add 5 of this item to your shopping bag');
        expect(state.errorState.configureErrors).toEqual({});
        expect(state.errorState.quantityError).toBeUndefined();
    });

    it('When add to cart fails, properly updates state when add to cart fails with CARTACTIONFAILED and result substatus MAXQUANTITY and uses default value', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContextNoMaxQuantity
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'CARTACTIONFAILED', cartActionResult: { status: 'FAILED', substatus: 'MAXQUANTITY'}});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toEqual('You can only add 10 of this item to your shopping bag');
        expect(state.errorState.configureErrors).toEqual({});
        expect(state.errorState.quantityError).toBeUndefined();
    });

    it('When add to cart fails, properly updates state when add to cart fails with OUTOFSTOCK and 0 stock left', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'OUTOFSTOCK', stockLeft: 0});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toBeUndefined();
        expect(state.errorState.configureErrors).toEqual({});
        expect(state.errorState.quantityError).toEqual('This product is out of stock');
    });

    it('When add to cart fails, properly updates state when add to cart fails with OUTOFSTOCK and 1 stock left', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'OUTOFSTOCK', stockLeft: 1});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toBeUndefined();
        expect(state.errorState.configureErrors).toEqual({});
        expect(state.errorState.quantityError).toEqual('There is only one product left. Please choose quantity within the available range');
    });

    it('When add to cart fails, properly updates state when add to cart fails with OUTOFSTOCK and more than one stock left', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'OUTOFSTOCK', stockLeft: 5});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toBeUndefined();
        expect(state.errorState.configureErrors).toEqual({});
        expect(state.errorState.quantityError).toEqual('There are only 5 products left. Please choose quantity within the available range');
    });

    it('When add to cart fails, properly updates state when add to cart fails with MISSINGDIMENSION', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'MISSINGDIMENSION', missingDimensions: [
            { DimensionTypeValue: 3 },
            { DimensionTypeValue: 1 },
            { DimensionTypeValue: 4 }
        ]});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toBeUndefined();
        expect(state.errorState.configureErrors[1]).toEqual('Color is required. Please choose a color');
        expect(state.errorState.configureErrors[2]).toBeUndefined();
        expect(state.errorState.configureErrors[3]).toEqual('Size is required. Please choose a size');
        expect(state.errorState.configureErrors[4]).toEqual('Style is required. Please choose a style');
        expect(state.errorState.quantityError).toBeUndefined();
    });

    it('When add to cart fails, properly updates state when add to cart fails with MISSINGDIMENSION but no missing dimensions returned', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'MISSINGDIMENSION'});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toBeUndefined();
        expect(state.errorState.configureErrors).toEqual({});
    });

    it('When add to cart fails, properly updates state when add to cart fails with MISSINGDIMENSION even if dimension ids don\'t match whats expected', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        // @ts-ignore
        const addToCartProps: IAddToCartComponentProps = viewProps.addToCart.button!.props;

        addToCartProps.onError!({failureReason: 'MISSINGDIMENSION', missingDimensions: [
            { DimensionTypeValue: 2 },
            { DimensionTypeValue: 5 }
        ]});

        const state: IBuyboxState = result.state() as IBuyboxState;

        expect(state.errorState.errorHost).toEqual('ADDTOCART');
        expect(state.errorState.otherError).toBeUndefined();
        expect(state.errorState.configureErrors[1]).toBeUndefined();
        expect(state.errorState.configureErrors[2]).toEqual('Configuration is required. Please choose a configuration');
        expect(state.errorState.configureErrors[3]).toBeUndefined();
        expect(state.errorState.configureErrors[4]).toBeUndefined();
        expect(state.errorState.configureErrors[5]).toEqual('');
        expect(state.errorState.quantityError).toBeUndefined();
    });

    it('Callbacks work', async () => {
        let callbacks: IBuyboxCallbacks | undefined;
        // @ts-ignore
        getBuyboxProductConfigure = jest.fn().mockImplementation((props, state, callback) => {
            callbacks = callback;
            return undefined;
        });

        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(getBuyboxProductConfigure).toBeCalled();

        expect(callbacks).toBeDefined();

        callbacks!.updateErrorState({
            errorHost: 'ADDTOCART',
            configureErrors: {
                1: 'Error 1',
                2: 'Error 2',
                4: 'Error 4'
            }
        });

        // @ts-ignore gets confused by path
        expect(result.state().errorState.configureErrors[1]).toEqual('Error 1');

        // @ts-ignore gets confused by path
        expect(result.state().errorState.configureErrors[2]).toEqual('Error 2');

        // @ts-ignore gets confused by path
        expect(result.state().errorState.configureErrors[4]).toEqual('Error 4');
    });

    it('updateSelectedProduct Callbacks', async () => {
        let callbacks: IBuyboxCallbacks | undefined;
        // @ts-ignore
        getBuyboxProductConfigure = jest.fn().mockImplementation((props, state, callback) => {
            callbacks = callback;
            return undefined;
        });

        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        expect(getBuyboxProductConfigure).toBeCalled();

        expect(callbacks).toBeDefined();

        callbacks!.updateSelectedProduct(new Promise<SimpleProduct | null>((resolve) => resolve(null)));

        // @ts-ignore gets confused by path
        expect(result.state().selectedProduct).toBeDefined();

        // @ts-ignore gets confused by path
        expect(await (result.state().selectedProduct)).toEqual(null);
    });

    it('_getDropdownName tests', () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: mockDimensions,
                    } as AsyncResult<ProductDimensionFull[]>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;

        expect(viewProps.callbacks.getDropdownName(1, mockResources)).toEqual('Color');
        expect(viewProps.callbacks.getDropdownName(2, mockResources)).toEqual('Configuration');
        expect(viewProps.callbacks.getDropdownName(3, mockResources)).toEqual('Size');
        expect(viewProps.callbacks.getDropdownName(4, mockResources)).toEqual('Style');
        expect(viewProps.callbacks.getDropdownName(5, mockResources)).toEqual('');
    });

    it('dimensionSelectedAsync -- updates state to newly selected dimension', async () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: mockDimensions,
                    } as AsyncResult<ProductDimensionFull[]>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;

        await viewProps.callbacks.dimensionSelectedAsync(4, '0');

        // @ts-ignore gets confused by path
        expect(result.state().selectedDimensions[4]).toEqual('0');
    });

    it('dimensionSelectedAsync -- clears error states after selecting new dimension', async () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: mockDimensions,
                    } as AsyncResult<ProductDimensionFull[]>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;

        viewProps.callbacks.updateErrorState({
            errorHost: 'ADDTOCART',
            configureErrors: {
                1: 'Error 1',
                2: 'Error 2',
                4: 'Error 4'
            }
        });

        await viewProps.callbacks.dimensionSelectedAsync(4, '0');

        // @ts-ignore gets confused by path
        expect(result.state().errorState.configureErrors[4]).toBeUndefined();
    });

    it('dimensionSelectedAsync -- If getSelectedVariant returns null doesnt get dimensions', async () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: mockDimensions,
                    } as AsyncResult<ProductDimensionFull[]>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;

        // @ts-ignore
        RetailActions.getSelectedVariant = jest.fn().mockResolvedValue(undefined);
        // @ts-ignore
        RetailActions.getDimensionsForSelectedVariant = jest.fn().mockResolvedValue(undefined);

        await viewProps.callbacks.dimensionSelectedAsync(4, '0');

        // @ts-ignore
        const selectedProduct = await result.state().selectedProduct;

        expect(selectedProduct).toBeUndefined();
        expect(RetailActions.getSelectedVariant).toBeCalled();
        expect(RetailActions.getDimensionsForSelectedVariant).not.toBeCalled();
    });

    it('dimensionSelectedAsync -- If getSelectedVariant returns not null, does get dimensions', async () => {
        moduleProps = {
            ...buildMockModuleProps(
                {
                    ...mockData,
                    product: {
                        status: 'SUCCESS',
                        result: {
                            RecordId: 10
                        },
                    } as AsyncResult<SimpleProduct>,
                    productDimensions: {
                        status: 'SUCCESS',
                        result: mockDimensions,
                    } as AsyncResult<ProductDimensionFull[]>
                },
                {},
                {},
                mockContext
            ) as IBuyboxModifiedProps<IBuyboxModifiedData>,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
            slots: mockSlots,
            resources: mockResources
        };

        const result = mount(<Buybox {...moduleProps} />);

        const viewProps: IBuyboxViewProps = result.childAt(0).props().props;

        // @ts-ignore
        RetailActions.getSelectedVariant = jest.fn().mockResolvedValue({RecordId: '10'});
        // @ts-ignore
        RetailActions.getDimensionsForSelectedVariant = jest.fn().mockResolvedValue(undefined);

        await viewProps.callbacks.dimensionSelectedAsync(4, '0');

        // @ts-ignore
        const selectedProduct = await result.state().selectedProduct;

        expect(selectedProduct).not.toBeUndefined();
        expect(RetailActions.getSelectedVariant).toBeCalled();
        expect(RetailActions.getDimensionsForSelectedVariant).toBeCalled();
    });
});