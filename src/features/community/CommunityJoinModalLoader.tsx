'use client';

import dynamic from 'next/dynamic';

// Code-split the modal into its own chunk, but keep it server-renderable: the
// modal renders `null` until opened (BaseModal gates on a client-mounted
// flag), so there is nothing to gain from `ssr: false` — and `ssr: false` on
// a component mounted in the root layout forces a `BAILOUT_TO_CLIENT_SIDE_
// RENDERING` boundary into every page's HTML.
const CommunityJoinModal = dynamic(() => import('./CommunityJoinModal'));

export default CommunityJoinModal;
