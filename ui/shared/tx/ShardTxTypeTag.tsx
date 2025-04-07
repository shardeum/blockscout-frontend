import { Tag, TagProps, Tooltip } from '@chakra-ui/react';
import React from 'react';

import parseShardTxType from 'lib/tx/parseShardTxType';

interface Props extends Omit<TagProps, 'colorScheme'> {
  txInput?: string;
  showTooltip?: boolean;
  isLoading?: boolean;
}

const ShardTxTypeTag = ({ txInput, showTooltip = true, isLoading, ...rest }: Props) => {
  const txType = parseShardTxType(txInput);

  if (!txType && !isLoading) {
    return null;
  }

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

  const tag = (
    <Tag
      colorScheme={ txType ? getColorScheme(txType.typeCode) : 'blue' }
      variant="solid"
      fontSize="sm"
      lineHeight="base"
      isLoading={ isLoading }
      { ...rest }
    >
      { txType?.typeName || 'Loading...' }
    </Tag>
  );

  if (showTooltip && txType) {
    return (
      <Tooltip label={ `Shardeum transaction type: ${ txType.typeName } (${ txType.typeCode })` }>
        { tag }
      </Tooltip>
    );
  }

  return tag;
};

export default ShardTxTypeTag;