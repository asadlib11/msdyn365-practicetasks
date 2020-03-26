/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { render } from 'enzyme';
import * as React from 'react';
import { BuyboxView, IBuyboxViewProps } from '../../..';

describe('Buybox unit tests - View', () => {
    it('renders correctly', () => {
        const moduleProps: IBuyboxViewProps= buildMockModuleProps({}, {}) as IBuyboxViewProps;
        const mockProps = {
            ...moduleProps,
            ModuleProps: {
                moduleProps,
                className: 'ms-buybox'
            },
            ProductInfoContainerProps: {
                className: 'ms-buybox__content'
            },
            MediaGalleryContainerProps: {
                className: 'ms-buybox__media-gallery'
            },
            callbacks: {
                updateQuantity: jest.fn(),
                updateErrorState: jest.fn(),
                dimensionSelectedAsync: jest.fn(),
                updateSelectedProduct: jest.fn(),
                getDropdownName: jest.fn()
            },
            title: <div>Title</div>,
            description: <div>Description</div>,
            findInStore: {
                ContainerProps: {
                    className: 'ms-buybux__find-in-store'
                },
                heading: <div>Find In Store Heading</div>,
                description: <div>Find In Store Description</div>,
                errors: <div>Find In Store Errors</div>,
                button: <div>Find In Store Button</div>,
                storeSelector: <div>Find In Store Selector</div>,
                openFindInStoreDialog: jest.fn()
            },
            mediaGallery: <div>Media Gallery</div>,
            price: <div>Price</div>,
            addToCart: {
                ContainerProps: {
                    className: 'ms-buybox__add-to-cart-container'
                },
                errorBlock: <div>Add to cart errors</div>,
                button: <div>Add to cart button</div>,
            },
            addToWishlist: {
                ContainerProps: {
                    className: 'ms-buybox__add-to-wishlist-container'
                },
                errorBlock: <div>Add to wishlist errors</div>,
                button: <div>Add to wishlist button</div>,
            },
            rating: <div>Rating</div>,
            quantity: {
                ContainerProps: {
                    className: 'ms-buybux__quantity'
                },
                LabelContainerProps: {
                    className: 'ms-buybux__quantity-label'
                },
                heading: <div>Heading</div>,
                errors: <div>Errors</div>,
                input: <div>Input</div>
            },
            configure: {
                ContainerProps: {
                    className: 'ms-buybux__configure'
                },

                dropdowns: [
                    {
                        ContainerProps: { className: 'ms-buybox__configure-dropdown' },
                        LabelContainerProps: {className: 'ms-buybox__configure-dropdown-label' },
                        heading: (<div>Heading 1</div>),
                        errors: (<div>Errors 1</div>),
                        select: (<div>Select 1</div>)
                    },
                    {
                        ContainerProps: { className: 'ms-buybox__configure-dropdown' },
                        LabelContainerProps: {className: 'ms-buybox__configure-dropdown-label' },
                        heading: (<div>Heading 2</div>),
                        errors: (<div>Errors 2</div>),
                        select: (<div>Select 2</div>)
                    }
                ]
            }
        };
        const component = render(<BuyboxView {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});
