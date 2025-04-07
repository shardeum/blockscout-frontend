// Utility for parsing Shardeum transaction types from transaction input

// Define Shardeum transaction structure interface
interface ShardTxData {
  internalTXType?: number;
  [key: string]: unknown;
}

export const TX_TYPE_MAPPINGS: Record<string, string> = {
  '0': 'SetGlobalCodeBytes',
  '1': 'InitNetwork',
  '2': 'NodeReward',
  '3': 'ChangeConfig',
  '4': 'ApplyChangeConfig',
  '5': 'SetCertTime',
  '6': 'Stake',
  '7': 'Unstake',
  '8': 'InitRewardTimes',
  '9': 'ClaimReward',
  '10': 'ChangeNetworkParam',
  '11': 'ApplyNetworkParam',
  '12': 'Penalty',
  '13': 'TransferFromSecureAccount',
};

/**
   * Parses the input data of a transaction to extract Shardeum-specific type information
   * @param inputHex The transaction input data in hex format
   * @returns An object with typeCode and typeName if found, or null if not found
   */
export const parseShardTxType = (inputHex: string | undefined): { typeCode: string; typeName: string } | null => {
  if (!inputHex || inputHex === '0x') return null;

  try {
    // Remove 0x prefix if present
    const cleanInput = inputHex.startsWith('0x') ? inputHex.substring(2) : inputHex;

    // Try to convert hex to UTF-8 string
    let str = '';
    for (let i = 0; i < cleanInput.length; i += 2) {
      const byte = parseInt(cleanInput.substr(i, 2), 16);
      // Only include printable ASCII characters
      if (byte >= 32 && byte <= 126) {
        str += String.fromCharCode(byte);
      }
    }

    // Look for JSON patterns
    const jsonStart = str.indexOf('{');
    const jsonEnd = str.lastIndexOf('}');

    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = str.substring(jsonStart, jsonEnd + 1);
      try {
        const jsonData = JSON.parse(jsonStr) as ShardTxData;

        // Extract internalTXType if present
        if (jsonData && typeof jsonData.internalTXType !== 'undefined') {
          const typeCode = jsonData.internalTXType.toString();
          return { typeCode, typeName: TX_TYPE_MAPPINGS[typeCode] || `Unknown Type (${ typeCode })` };
        }
      } catch (e) { /* JSON parse error - silent fail */ }
    }
  } catch (e) { /* Error parsing data - silent fail */ }

  return null;
};

export default parseShardTxType;
