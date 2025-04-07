import { useEffect, useState } from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import parseShardTxType from 'lib/tx/parseShardTxType';

type TransactionRawInputCache = Record<string, string | null>;
type TransactionTypeCache = Record<string, { isStake: boolean; isUnstake: boolean }>;

// Cache to avoid redundant API requests for the same transaction
const rawInputCache: TransactionRawInputCache = {};
const txTypeCache: TransactionTypeCache = {};

/**
 * Custom hook to efficiently fetch transaction raw_input data for display of Shardeum transaction types
 *
 * @param txHash Transaction hash to fetch raw_input for
 * @returns An object with raw_input data and loading state
 */
const useTransactionRawInput = (txHash: string | undefined) => {
  const [ rawInput, setRawInput ] = useState<string | null>(txHash && typeof txHash === 'string' ? rawInputCache[txHash] || null : null);
  const [ isLoading, setIsLoading ] = useState<boolean>(!rawInput && Boolean(txHash));

  // Check if this hash is in the cache
  const isInCache = txHash && typeof txHash === 'string' ? rawInputCache[txHash] !== undefined : false;

  // Fetch transaction details if needed and not already in cache
  const { data: txData, isLoading: isTxLoading } = useApiQuery('tx', {
    pathParams: { hash: txHash },
    queryOptions: {
      enabled: Boolean(txHash) && !isInCache,
      refetchOnMount: false,
      staleTime: Infinity,
    },
  });

  // Update cache and state when data is loaded
  useEffect(() => {
    if (txData && txHash && typeof txHash === 'string' && !isInCache) {
      const newRawInput = txData.raw_input || null;
      rawInputCache[txHash] = newRawInput;
      setRawInput(newRawInput);
      setIsLoading(false);
    }
  }, [ txData, txHash, isInCache ]);

  // Reset state when transaction hash changes
  useEffect(() => {
    if (txHash && typeof txHash === 'string') {
      if (rawInputCache[txHash] !== undefined) {
        setRawInput(rawInputCache[txHash]);
        setIsLoading(false);
      } else {
        setRawInput(null);
        setIsLoading(true);
      }
    } else {
      setRawInput(null);
      setIsLoading(false);
    }
  }, [ txHash ]);

  // Parse the transaction type once we have the raw input
  useEffect(() => {
    if (txHash && typeof txHash === 'string' && rawInput && !txTypeCache[txHash]) {
      const txType = parseShardTxType(rawInput);
      // Determine if this is a Stake or Unstake transaction
      const isStake = txType?.typeCode === '6';
      const isUnstake = txType?.typeCode === '7';

      // Store the results in the cache
      txTypeCache[txHash] = {
        isStake,
        isUnstake,
      };

      // Apply additional heuristics to catch more stake/unstake transactions
      const rawLower = rawInput.toLowerCase();

      // Enhanced detection for unstake transactions
      if (!isUnstake && (
        // Direct keywords in raw input
        rawLower.includes('unstake') ||
        rawLower.includes('unstaking') ||
        rawLower.includes('un-stake') ||
        rawLower.includes('withdraw stake') ||
        rawLower.includes('remove stake') ||
        // JSON properties indicating unstake
        rawLower.includes('"type":"unstake"') ||
        rawLower.includes('"type":7') ||
        rawLower.includes('"type": 7') ||
        rawLower.includes('"internalTXType":7') ||
        rawLower.includes('"internalTXType": 7') ||
        // Contract interaction patterns
        rawLower.includes('"unstake(') ||
        rawLower.includes('unstake(') ||
        rawLower.includes('withdraw(') ||
        // Look for "stake" with "withdraw" nearby
        (rawLower.includes('stake') && (rawLower.includes('withdraw') || rawLower.includes('remove')))
      )) {
        txTypeCache[txHash].isUnstake = true;
      }
      // Extended detection for stake transactions that might be missed
      if (!isStake && !txTypeCache[txHash].isUnstake && (
        (rawLower.includes('stake') && !rawLower.includes('unstake')) ||
        rawLower.includes('staking') ||
        rawLower.includes('"type":6') ||
        rawLower.includes('"type": 6') ||
        rawLower.includes('"internalTXType":6') ||
        rawLower.includes('"internalTXType": 6')
      )) {
        txTypeCache[txHash].isStake = true;
      }

      // For debugging - intentionally commented out
      // if (txTypeCache[txHash].isUnstake) {
      //   // Log detected unstake transaction
      // }
    }
  }, [ txHash, rawInput ]);

  // Determine if this is a Stake or Unstake transaction
  const txType = txHash && typeof txHash === 'string' && txTypeCache[txHash] ?
    txTypeCache[txHash] :
    { isStake: false, isUnstake: false };
  return {
    rawInput,
    isLoading: isLoading || isTxLoading,
    isStake: txType.isStake,
    isUnstake: txType.isUnstake,
    shardTxType: rawInput ? parseShardTxType(rawInput) : null,
  };
};

export default useTransactionRawInput;
