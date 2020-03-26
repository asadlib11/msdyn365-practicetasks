/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { render, shallow } from 'enzyme';
import * as React from 'react';

import { Dropdown } from '../../components/dropdown/dropdown';
import { IDropdownProps } from '../../components/dropdown/dropdown.props';

const defaultMockProps: IDropdownProps = {
    dropdownId: '1',
    dropdownName: 'Size',
    dropdownList: ['Large', 'Small', 'Child'],
    dropdownToggleName: 'Size'
};

describe('Dropdown Component', () => {
    it('Renders properly', () => {
        const component = render(<Dropdown {...defaultMockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('Calls callback, sets state', () => {
        const component = shallow(<Dropdown {...defaultMockProps} />);

        const select = component.find('.msc-dropdown__select').at(0);

        select.simulate('change', { target: { value: '1' }});

        // @ts-ignore
        expect(component.state().selectedIndex).toBe('1');
    });

    it('Calls callback, passes it onto other callback if set', () => {
        const mockProps = {
            ...defaultMockProps,
            onChange: jest.fn()
        };

        const component = shallow(<Dropdown {...mockProps} />);

        const select = component.find('.msc-dropdown__select').at(0);

        select.simulate('change', { target: { value: '1', innerText: 'Red' }});

        expect(mockProps.onChange).toBeCalledWith(
            expect.objectContaining({
                dropdownId: '1',
                selectId: '1',
                selectedValue: 'Red'
            })
        );
    });
});