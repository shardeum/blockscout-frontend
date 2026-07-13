import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Cosmos SDK REST API';

const config: Feature<{ restApiUrl: string }> = (() => {
  const restApiUrl = getEnvValue('NEXT_PUBLIC_COSMOS_REST_API_URL');

  if (restApiUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      restApiUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
