'use client';

import dynamic from 'next/dynamic';

// Wraps the dynamic import in a Client Component so `ssr: false` can be used
// from the (Server Component) root layout.
const CommunityJoinModal = dynamic(() => import('./CommunityJoinModal'), {
  ssr: false,
});

export default CommunityJoinModal;
