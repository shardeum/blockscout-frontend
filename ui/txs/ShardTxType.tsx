import React from 'react';

import parseShardTxType from 'lib/tx/parseShardTxType';
import Tag from 'ui/shared/chakra/Tag';
import TxType, { Props as TxTypeProps } from 'ui/txs/TxType';

interface Props extends TxTypeProps {
  input?: string;
}

const ShardTxType = ({ types, isLoading, input }: Props) => {
  // First try to parse Shardeum transaction type
  const txType = parseShardTxType(input);

  if (txType) {
    // Define color schemes based on transaction type
    const getColorScheme = (typeCode: string): string => {
      switch (typeCode) {
        case '6': // Stake
          return 'green';
        case '7': // Unstake
          return 'red';
        case '9': // ClaimReward
          return 'orange';
        case '12': // Penalty
          return 'pink';
        case '2': // NodeReward
        case '8': // InitRewardTimes
          return 'yellow';
        default:
          return 'blue';
      }
    };

    // If Shardeum transaction type is found, display it
    return (
      <Tag
        colorScheme={ getColorScheme(txType.typeCode) }
        isLoading={ isLoading }
      >
        { txType.typeName }
      </Tag>
    );
  }

  // Otherwise fall back to default transaction type display
  return <TxType types={ types } isLoading={ isLoading } />;
};

export default ShardTxType;