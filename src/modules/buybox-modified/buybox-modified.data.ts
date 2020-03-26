/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IStoreSelectorStateManager } from '@msdyn365-commerce-modules/bopis-utilities';
import { ProductDimensionFull, RatingsSummary } from '@msdyn365-commerce/commerce-entities';
import { ICartState } from '@msdyn365-commerce/global-state';
import { AsyncResult, CommerceList, ProductPrice, SimpleProduct } from '@msdyn365-commerce/retail-proxy';

export interface IBuyboxModifiedData {
    product: AsyncResult<SimpleProduct>;
    productDimensions: AsyncResult<ProductDimensionFull[]>;
    productPrice: AsyncResult<ProductPrice>;
    ratingsSummary: AsyncResult<RatingsSummary>;
    storeSelectorStateManager: AsyncResult<IStoreSelectorStateManager>;
    wishlists: AsyncResult<CommerceList[]>;
    cart: AsyncResult<ICartState>;
}
