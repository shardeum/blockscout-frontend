import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

import type { AdvancedFilterParams, AdvancedFilterResponseItem } from 'types/api/advancedFilter';

import useTransactionRawInput from 'lib/tx/useTransactionRawInput';
import type { ColumnsIds } from 'ui/advancedFilter/constants';

import ItemByColumn from './ItemByColumn';

type Props = {
  item: AdvancedFilterResponseItem;
  columnsToShow: Array<{ id: ColumnsIds; isNumeric?: boolean; width: string }>;
  isLoading?: boolean;
  filters?: AdvancedFilterParams;
};

const TransactionRow = ({ item, columnsToShow, isLoading, filters }: Props) => {
  // Check if we need to filter by Stake/Unstake types
  const isStakeFilter = filters?.transaction_types?.includes('stake');
  const isUnstakeFilter = filters?.transaction_types?.includes('unstake');
  
  // Use our custom hook to efficiently fetch raw_input for this transaction
  const { isStake, isUnstake, isLoading: isRawInputLoading } = useTransactionRawInput(item.hash);

  // Handle direct filtering for Stake and Unstake when only those filters are active
  if (isStakeFilter && !isUnstakeFilter && filters?.transaction_types?.length === 1) {
    // Only Stake filter is active, show only stake transactions
    if (!isStake) {
      return null;
    }
  } 
  else if (isUnstakeFilter && !isStakeFilter && filters?.transaction_types?.length === 1) {
    // Only Unstake filter is active, show only unstake transactions
    if (!isUnstake) {
      return null;
    }
  } 
  else if (filters?.transaction_types?.length) {
    // Other filters are active
    const hasStandardTypeFilters = filters.transaction_types.some(
      type => [ 'coin_transfer', 'ERC-20', 'ERC-404', 'ERC-721', 'ERC-1155' ].includes(type)
    );
    
    // Get the transaction's standard type
    const standardType = item.type;
    
    if (isStakeFilter || isUnstakeFilter) {
      // If there are both standard and Stake/Unstake filters active,
      // show if transaction matches ANY of the filters
      const matchesStandardFilter = hasStandardTypeFilters && filters.transaction_types.includes(standardType);
      const matchesStakeFilter = isStakeFilter && isStake;
      const matchesUnstakeFilter = isUnstakeFilter && isUnstake;
      
      if (!matchesStandardFilter && !matchesStakeFilter && !matchesUnstakeFilter) {
        // Transaction doesn't match any of the active filters
        return null;
      }
    } else if (hasStandardTypeFilters) {
      // Standard filters are active (no Stake/Unstake filters)
      // Exclude Stake/Unstake transactions when filtering by standard types
      if ((isStake || isUnstake) && filters.transaction_types.includes('coin_transfer')) {
        // This is a Stake or Unstake transaction but we're filtering for coin_transfer only
        return null;
      }
    }
  }

  // If no Stake/Unstake filter is active or the transaction passes the filter, render the row
  return (
    <Tr data-tx-hash={ item.hash }>
      { columnsToShow.map(column => (
        <Td
          key={ item.hash + column.id }
          isNumeric={ column.isNumeric }
          minW={ column.width }
          maxW={ column.width }
          w={ column.width }
          wordBreak="break-word"
          whiteSpace="nowrap"
          overflow="hidden"
          textAlign={ column.id === 'or_and' ? 'center' : 'start' }
        >
          <ItemByColumn
            item={ item }
            column={ column.id }
            isLoading={ isLoading || isRawInputLoading }
            filters={ filters }
          />
        </Td>
      )) }
    </Tr>
  );
};

export default TransactionRow;