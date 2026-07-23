import { Alert, AlertIcon, AlertTitle, Link } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

const DashboardInfoAlert = () => {
  if (!config.UI.dashboardInfoAlert.message) {
    return null;
  }

  return (
    <Alert status="info" colorScheme="blue" py={ 3 } borderRadius="md">
      <AlertIcon display={{ base: 'none', lg: 'flex' }}/>
      <AlertTitle
        dangerouslySetInnerHTML={{ __html: config.UI.dashboardInfoAlert.message }}
        sx={{
          '& a': {
            color: 'link',
            _hover: {
              color: 'link_hovered',
            },
          },
        }}
      />
    </Alert>
  );
};

export default React.memo(DashboardInfoAlert);
