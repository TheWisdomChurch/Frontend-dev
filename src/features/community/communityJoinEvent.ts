export const COMMUNITY_JOIN_EVENT = 'wisdom-church:join-community';

export function requestCommunityJoin(): void {
  window.dispatchEvent(new Event(COMMUNITY_JOIN_EVENT));
}
