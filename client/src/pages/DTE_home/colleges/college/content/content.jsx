import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import About from './about';
import Notices from './Notices';
import Placement from './placement';
import Message from './message';

const Content = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Check if current college is MACET (only id=0)
  const isMacet = () => {
    const queryId = searchParams.get('id');
    return queryId === '0';
  };

  return (
    <>
      <Notices />
      <About />
      {isMacet() && (
        <>
          <Placement />
          <Message />
        </>
      )}
    </>
  );
};

export default Content;