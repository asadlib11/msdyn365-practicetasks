import { AsyncResult, SimpleProduct } from '@msdyn365-commerce/retail-proxy';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IMyFeaturedContentData {
    actionResponse: {text: string};
    products: AsyncResult<SimpleProduct>[];
}