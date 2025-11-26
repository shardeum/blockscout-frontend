import {
  Tr,
  Td,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import Tag from 'ui/shared/chakra/Tag';
import CurrencyValue from 'ui/shared/CurrencyValue';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';
import TxFee from 'ui/shared/tx/TxFee';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import ShardTxType from './ShardTxType';
import TxTranslationType from './TxTranslationType';

type Props = {
  tx: Transaction;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
};

const TxsTableItem = ({ tx, showBlockInfo, currentAddress, enableTimeIncrement, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  return (
    <Tr
      as={ motion.tr }
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      key={ tx.hash }
    >
      <Td pl={ 4 }>
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading }/>
      </Td>
      <Td pr={ 4 }>
        <VStack alignItems="start" lineHeight="24px">
          <TxEntity
            hash={ tx.hash }
            isLoading={ isLoading }
            fontWeight={ 700 }
            noIcon
            maxW="100%"
            truncation="constant_long"
          />
          <TimeAgoWithTooltip
            timestamp={ tx.timestamp }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text_secondary"
            fontWeight="400"
          />
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start">
          { tx.translation ? (
            <TxTranslationType
              types={ tx.transaction_types }
              isLoading={ isLoading || tx.translation.isLoading }
              translatationType={ tx.translation.data?.type }
            />
          ) :
            <ShardTxType types={ tx.transaction_types } input={ tx.raw_input } isLoading={ isLoading }/>
          }
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </VStack>
      </Td>
      <Td whiteSpace="nowrap">
        { (() => {
          const isCoinTransfer = tx.transaction_types.includes('coin_transfer') &&
                        !tx.transaction_types.some(t => t.startsWith('cosmos_'));
          // Normalize coin transfer methods to 'send'
          const rawMethod = tx.method || '';
          const isCoinTransferMethod = [ 'send', 'Send', 'EVM Transfer', 'transfer', 'Transfer' ].includes(rawMethod);
          const method = (isCoinTransfer || isCoinTransferMethod) && !rawMethod.includes('Multicall') ?
            'send' :
            rawMethod;
          return method ? (
            <Tag colorScheme={ method === 'Multicall' ? 'teal' : 'gray' } isLoading={ isLoading } isTruncated>
              { method }
            </Tag>
          ) : null;
        })() }
      </Td>
      { showBlockInfo && (
        <Td>
          { tx.block_number && (
            <BlockEntity
              isLoading={ isLoading }
              number={ tx.block_number }
              noIcon
              fontSize="sm"
              lineHeight={ 6 }
              fontWeight={ 500 }
            />
          ) }
        </Td>
      ) }
      <Td>
        <AddressFromTo
          from={ tx.from }
          to={ dataTo }
          current={ currentAddress }
          isLoading={ isLoading }
          mt="2px"
          mode="compact"
        />
      </Td>
      { !config.UI.views.tx.hiddenFields?.value && (
        <Td isNumeric>
          <CurrencyValue value={ tx.value } accuracy={ 8 } isLoading={ isLoading }/>
        </Td>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Td isNumeric maxW="220px">
          <TxFee
            tx={ tx }
            accuracy={ 8 }
            isLoading={ isLoading }
            withCurrency={ Boolean(tx.celo || tx.stability_fee) }
            justifyContent="end"
          />
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(TxsTableItem);
