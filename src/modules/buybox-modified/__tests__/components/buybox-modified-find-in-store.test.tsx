/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { shallow } from 'enzyme';
import * as React from 'react';

import { IStoreSelectionStateContext, IStoreSelectorStateManager } from '@msdyn365-commerce-modules/bopis-utilities';
import * as Core from '@msdyn365-commerce/core';
import { AsyncResult, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { IBuyboxCallbacks, IBuyboxModifiedData, IBuyboxModifiedProps, IBuyboxState } from '../../../../index';
import { mockResources } from '../../__mocks__/mock-resources';
import { getBuyboxFindInStore } from '../../components';

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

describe('Buybox Find In Store', () => {
    let moduleProps: IBuyboxModifiedProps<IBuyboxModifiedData>;

    beforeEach(() => {
        // @ts-ignore
        mockCallbacks.updateErrorState.mockClear();
        // @ts-ignore
        mockCallbacks.dimensionSelectedAsync.mockClear();
        // @ts-ignore
        mockCallbacks.updateQuantity.mockClear();
    });

    it('returns null if there is no product', () => {
        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'FAILED',
                        result: undefined
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'FAILED',
                        result: undefined
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div>Store selector</div>)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeUndefined();
    });

    it('returns null if there is no store selector state manager', () => {
        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'FAILED',
                        result: undefined,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'FAILED',
                        result: undefined
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div>Store selector</div>)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeUndefined();
    });

    it('returns null if there is no store selector slot', () => {
        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'FAILED',
                        result: undefined
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: []
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeUndefined();
    });

    it('returns valid data when product, store selector state manager and store selector slot all present', () => {
        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'FAILED',
                        result: undefined
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();

        expect(findInStore!.heading).toBeTruthy();
        expect(findInStore!.description).toBeTruthy();
        expect(findInStore!.button).toBeTruthy();
        expect(findInStore!.errors).toBeTruthy(); // errors present, they'll just be closed
        expect(findInStore!.storeSelector).toBeTruthy();
    });

    it('includes error block if error host matches', () => {
        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'FAILED',
                        result: undefined
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const mockStateOverride: IBuyboxState = {
            ...mockState,
            errorState: {
                errorHost: 'FINDINSTORE',
                configureErrors: {}
            }
        };

        const findInStore = getBuyboxFindInStore(moduleProps, mockStateOverride, mockCallbacks);

        expect(findInStore).toBeDefined();

        expect(findInStore!.errors).toBeTruthy(); // no errors present
    });

    it('button disabled if no cart present', async () => {
        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: {},
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'FAILED',
                        result: undefined
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        expect(findInStoreButton.props().disabled).toBeTruthy();
    });

    it('opens dialog on button click', async () => {
        // @ts-ignore impartial mock
        const mockStoreSelectorStateManager: IStoreSelectorStateManager = {
            openDialog: jest.fn().mockResolvedValue({})
        };

        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: mockStoreSelectorStateManager,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'SUCCESS',
                        result: {}
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        expect(findInStoreButton.props().disabled).not.toBeTruthy();

        findInStoreButton.simulate('click');

        expect(mockStoreSelectorStateManager.openDialog).toBeCalled();
    });

    it('exists cleanly if opens dialog fails', async () => {
        // @ts-ignore impartial mock
        const mockStoreSelectorStateManager: IStoreSelectorStateManager = {
            openDialog: jest.fn().mockRejectedValue('FAIL')
        };

        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: mockStoreSelectorStateManager,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'SUCCESS',
                        result: {}
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        expect(findInStoreButton.props().disabled).not.toBeTruthy();

        findInStoreButton.simulate('click');

        expect(mockStoreSelectorStateManager.openDialog).toBeCalled();
    });

    it('does not opens dialog on button click if missing dimensions', async () => {
        // @ts-ignore impartial mock
        const mockStoreSelectorStateManager: IStoreSelectorStateManager = {
            openDialog: jest.fn().mockResolvedValue({})
        };

        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {
                            Dimensions: [
                                {
                                    DimensionTypeValue: 1,
                                    DimensionValue: undefined
                                },
                                {
                                    DimensionTypeValue: 3,
                                    DimensionValue: {
                                        RecordId: 22565421223,
                                        Value: '32'
                                    }
                                }
                            ]
                        }
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: mockStoreSelectorStateManager,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'SUCCESS',
                        result: {}
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        expect(findInStoreButton.props().disabled).not.toBeTruthy();

        findInStoreButton.simulate('click');

        expect(mockStoreSelectorStateManager.openDialog).not.toBeCalled();
        expect(mockCallbacks.updateErrorState).toBeCalled();
    });

    it('uses selectedProduct if present rather than erroring', async () => {
        // @ts-ignore impartial mock
        const mockStoreSelectorStateManager: IStoreSelectorStateManager = {
            openDialog: jest.fn().mockResolvedValue({})
        };

        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {
                            Dimensions: [
                                {
                                    DimensionTypeValue: 1,
                                    DimensionValue: undefined
                                },
                                {
                                    DimensionTypeValue: 3,
                                    DimensionValue: {
                                        RecordId: 22565421223,
                                        Value: '32'
                                    }
                                }
                            ]
                        }
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: mockStoreSelectorStateManager,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'SUCCESS',
                        result: {}
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        // @ts-ignore partial mock
        const mockProduct: SimpleProduct = {
            Dimensions: [
                {
                    DimensionTypeValue: 1,
                    DimensionValue: {
                        RecordId: 22565421223,
                        Value: 'Blue'
                    }
                },
                {
                    DimensionTypeValue: 3,
                    DimensionValue: {
                        RecordId: 22565421223,
                        Value: '32'
                    }
                }
            ]
        };

        const updatedState = {
            ...mockState,
            selectedProduct: new Promise<SimpleProduct | null>((resolve) => {
                console.log('Calling this');
                resolve(mockProduct);
            })
        };

        const findInStore = getBuyboxFindInStore(moduleProps, updatedState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        expect(findInStoreButton.props().disabled).not.toBeTruthy();

        findInStoreButton.simulate('click');

        // tslint:disable-next-line:no-string-based-set-timeout
        await new Promise(resolve => { setTimeout(resolve, 0); });

        expect(mockStoreSelectorStateManager.openDialog).toBeCalled();
    });

    it('updates window location when url specified and result success', async () => {
        let context: IStoreSelectionStateContext | undefined;
        window.location.assign = jest.fn();

        // @ts-ignore impartial mock
        const mockStoreSelectorStateManager: IStoreSelectorStateManager = {
            openDialog: jest.fn().mockImplementation(input => {
                context = input;
                return Promise.resolve({});
            })
        };

        // @ts-ignore impartial mock
        const mockCartState: ICartState = {
            addProductToCart: jest.fn().mockResolvedValue({status: 'SUCCESS'})
        };

        // @ts-ignore
        Core.getUrlSync = jest.fn().mockReturnValue('foo');

        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: mockStoreSelectorStateManager,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'SUCCESS',
                        result: mockCartState
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        expect(findInStoreButton.props().disabled).not.toBeTruthy();

        findInStoreButton.simulate('click');

        expect(mockStoreSelectorStateManager.openDialog).toBeCalled();
        expect(context).toBeDefined();

        await context!.onLocationSelected({});

        expect(mockCartState.addProductToCart).toBeCalled();

        expect(window.location.assign).toHaveBeenCalledWith('foo');
    });

    it('does not updates window location when url not specified and result success', async () => {
        let context: IStoreSelectionStateContext | undefined;
        window.location.assign = jest.fn();

        // @ts-ignore impartial mock
        const mockStoreSelectorStateManager: IStoreSelectorStateManager = {
            openDialog: jest.fn().mockImplementation(input => {
                context = input;
                return Promise.resolve({});
            })
        };

        // @ts-ignore impartial mock
        const mockCartState: ICartState = {
            addProductToCart: jest.fn().mockResolvedValue({status: 'SUCCESS'})
        };

        // @ts-ignore
        Core.getUrlSync = jest.fn().mockReturnValue(undefined);

        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: mockStoreSelectorStateManager,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'SUCCESS',
                        result: mockCartState
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        expect(findInStoreButton.props().disabled).not.toBeTruthy();

        findInStoreButton.simulate('click');

        expect(mockStoreSelectorStateManager.openDialog).toBeCalled();
        expect(context).toBeDefined();

        await context!.onLocationSelected({});

        expect(mockCartState.addProductToCart).toBeCalled();

        expect(window.location.assign).not.toHaveBeenCalled();
    });

    it('does not updates window location when url specified and result fails', async () => {
        let context: IStoreSelectionStateContext | undefined;
        window.location.assign = jest.fn();

        // @ts-ignore impartial mock
        const mockStoreSelectorStateManager: IStoreSelectorStateManager = {
            openDialog: jest.fn().mockImplementation(input => {
                context = input;
                return Promise.resolve({});
            })
        };

        // @ts-ignore impartial mock
        const mockCartState: ICartState = {
            addProductToCart: jest.fn().mockResolvedValue({status: 'FAILED'})
        };

        // @ts-ignore
        Core.getUrlSync = jest.fn().mockReturnValue('foo');

        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: mockStoreSelectorStateManager,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'SUCCESS',
                        result: mockCartState
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        expect(findInStoreButton.props().disabled).not.toBeTruthy();

        findInStoreButton.simulate('click');

        expect(mockStoreSelectorStateManager.openDialog).toBeCalled();
        expect(context).toBeDefined();

        await context!.onLocationSelected({});

        expect(mockCartState.addProductToCart).toBeCalled();

        expect(window.location.assign).not.toHaveBeenCalled();
    });

    it('does not updates window location when url specified and result throws', async () => {
        let context: IStoreSelectionStateContext | undefined;
        window.location.assign = jest.fn();

        // @ts-ignore impartial mock
        const mockStoreSelectorStateManager: IStoreSelectorStateManager = {
            openDialog: jest.fn().mockImplementation(input => {
                context = input;
                return Promise.resolve({});
            })
        };

        // @ts-ignore impartial mock
        const mockCartState: ICartState = {
            addProductToCart: jest.fn().mockRejectedValue('FAIL')
        };

        // @ts-ignore
        Core.getUrlSync = jest.fn().mockReturnValue('foo');

        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: mockStoreSelectorStateManager,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'SUCCESS',
                        result: mockCartState
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        expect(findInStoreButton.props().disabled).not.toBeTruthy();

        findInStoreButton.simulate('click');

        expect(mockStoreSelectorStateManager.openDialog).toBeCalled();
        expect(context).toBeDefined();

        await context!.onLocationSelected({});

        expect(mockCartState.addProductToCart).toBeCalled();

        expect(window.location.assign).not.toHaveBeenCalled();
    });

    it('does not updates window location when url specified and no cart', async () => {
        let context: IStoreSelectionStateContext | undefined;
        window.location.assign = jest.fn();

        // @ts-ignore impartial mock
        const mockStoreSelectorStateManager: IStoreSelectorStateManager = {
            openDialog: jest.fn().mockImplementation(input => {
                context = input;
                return Promise.resolve({});
            })
        };

        // @ts-ignore
        Core.getUrlSync = jest.fn().mockReturnValue('foo');

        // @ts-ignore partial mock
        moduleProps = {
            ...Core.buildMockModuleProps(
                {
                    product: {
                        status: 'SUCCESS',
                        result: {}
                    } as AsyncResult<SimpleProduct>,
                    storeSelectorStateManager: {
                        status: 'SUCCESS',
                        result: mockStoreSelectorStateManager,
                    } as AsyncResult<IStoreSelectorStateManager>,
                    cart: {
                        status: 'FAILED',
                        result: undefined
                    }
                },
                {},
                {}
            ),
            slots: {
                mediaGallery: [],
                storeSelector: [(<div />)]
            },
            resources: mockResources
        } as IBuyboxModifiedProps<IBuyboxModifiedData>;

        const findInStore = getBuyboxFindInStore(moduleProps, mockState, mockCallbacks);

        expect(findInStore).toBeDefined();
        expect(findInStore!.button).toBeTruthy();

        const findInStoreButton = shallow(findInStore!.button! as React.ReactElement);

        findInStoreButton.simulate('click');

        expect(mockStoreSelectorStateManager.openDialog).toBeCalled();
        expect(context).toBeDefined();

        await context!.onLocationSelected({});

        expect(window.location.assign).not.toHaveBeenCalled();
    });
});
