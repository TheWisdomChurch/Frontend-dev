import PremiumHome from '@/features/PremiumHome';
import HomeDynamicSections from '@/features/home/HomeDynamicSections';
import HashScrollSync from '@/shared/components/HashScrollSync';

export default function Home() {
  return (
    <>
      <HashScrollSync />
      <PremiumHome />
      <HomeDynamicSections />
    </>
  );
}
