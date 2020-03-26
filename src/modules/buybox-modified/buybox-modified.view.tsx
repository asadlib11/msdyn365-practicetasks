/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import { IBuyboxViewProps } from './buybox-modified';
import {
    IBuyboxAddToCartViewProps,
    IBuyboxAddToWishlistViewProps,
    IBuyboxFindInStoreViewProps,
    IBuyboxProductConfigureDropdownViewProps,
    IBuyboxProductConfigureViewProps,
    IBuyboxProductQuantityViewProps
 } from './components';

const BuyboxView: React.FC<IBuyboxViewProps> = props => {
    const { ModuleProps, MediaGalleryContainerProps, ProductInfoContainerProps, addToCart, addToWishlist, configure, description, findInStore, quantity, price, title, rating } = props;
    return (
        <Module {...ModuleProps}>
            <Node {...MediaGalleryContainerProps}>
                {props.mediaGallery}
            </Node>
            <Node {...ProductInfoContainerProps}>
                {title}
                {price}
                {description}
                {rating}
                {configure && _renderConfigure(configure)}
                {quantity && _renderQuantity(quantity)}
                {addToCart && _renderAddToCart(addToCart)}
                {findInStore && _renderFindInStore(findInStore)}
                {addToWishlist && _renderAddToWishlist(addToWishlist)}
            </Node>
        </Module>
    );
};

const _renderAddToCart = (addToCart: IBuyboxAddToCartViewProps): JSX.Element => {
    const { ContainerProps, errorBlock, button } = addToCart;

    return (
        <Node {...ContainerProps}>
            {errorBlock}
            {button}
        </Node>
    );
};

const _renderAddToWishlist = (addToWishlist: IBuyboxAddToWishlistViewProps): JSX.Element => {
    const { ContainerProps, errorBlock, button } = addToWishlist;

    return (
        <Node {...ContainerProps}>
            {errorBlock}
            {button}
        </Node>
    );
};

const _renderConfigure = (configure: IBuyboxProductConfigureViewProps): JSX.Element => {
    const { ContainerProps, dropdowns } = configure;

    return (
        <Node {...ContainerProps}>
            {dropdowns.map(_renderConfigureDropdown)}
        </Node>
    );
};

const _renderConfigureDropdown = (dropdown: IBuyboxProductConfigureDropdownViewProps): JSX.Element => {
    const { ContainerProps, LabelContainerProps, heading, errors, select } = dropdown;

    return (
        <Node {...ContainerProps}>
            <Node {...LabelContainerProps}>
                {heading}
                {errors}
            </Node>
            {select}
        </Node>
    );
};

const _renderFindInStore = (findInStore: IBuyboxFindInStoreViewProps): JSX.Element => {
    const { ContainerProps, storeSelector, heading, description, errors, button } = findInStore;

    return (
        <Node {...ContainerProps}>
            {storeSelector}
            {heading}
            {description}
            {errors}
            {button}
        </Node>
    );
};

const _renderQuantity = (quantity: IBuyboxProductQuantityViewProps): JSX.Element => {
    const { ContainerProps, LabelContainerProps, heading, input, errors } = quantity;

    return (
        <Node {...ContainerProps}>
            <Node {...LabelContainerProps}>
                {heading}
                {errors}
            </Node>
            {input}
        </Node>
    );
};

export default BuyboxView;
