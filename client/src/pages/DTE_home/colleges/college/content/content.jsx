import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import About from './about';
import Notices from './Notices';
import Message from './message';

const Content = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Check if current college is GPC (id=1) or GPC Alwar (id=2)
  const isGpc = () => {
    const queryId = searchParams.get('id');
    return queryId === '1' || queryId === '2' || location.pathname.includes('gpc') || location.pathname.includes('gpcalwer');
  };

  return (
    <>
      <Notices />
      <About />
      {isGpc() && (
        <>
          <Message />
        </>
      )}
    </>
  );
};

export default Content;