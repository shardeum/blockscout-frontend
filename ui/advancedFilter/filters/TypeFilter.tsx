import { Flex, Checkbox, CheckboxGroup } from '@chakra-ui/react';
import { isEqual } from 'es-toolkit';
import React from 'react';

import type { AdvancedFilterParams, AdvancedFilterType } from 'types/api/advancedFilter';

import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

import { ADVANCED_FILTER_TYPES_WITH_ALL } from '../constants';

const RESET_VALUE = 'all';

type Props = {
  value?: Array<AdvancedFilterType>;
  handleFilterChange: (filed: keyof AdvancedFilterParams, value: Array<AdvancedFilterType>) => void;
  onClose?: () => void;
};

const TypeFilter = ({ value = [], onClose }: Props) => {
  // Always show the UI elements but don't actually filter
  const currentValue: Array<AdvancedFilterType> = [];

  // Empty handlers that don't do anything
  const onReset = React.useCallback(() => {}, []);
  const onFilter = React.useCallback(() => {}, []);

  return (
    <TableColumnFilter
      title="Type of transfer"
      isFilled={ false }
      isTouched={ false }
      onFilter={ onFilter }
      onReset={ onReset }
      onClose={ onClose }
      hasReset
    >
      <Flex display="flex" flexDir="column" rowGap={ 3 }>
        <CheckboxGroup value={ [ RESET_VALUE ] }>
          { ADVANCED_FILTER_TYPES_WITH_ALL.map(type => (
            <Checkbox
              key={ type.id }
              value={ type.id }
              id={ type.id }
              // Disabled onChange handler
              onChange={ () => {} }
            >
              { type.name }
            </Checkbox>
          )) }
        </CheckboxGroup>
      </Flex>
    </TableColumnFilter>
  );
};

export default TypeFilter;
