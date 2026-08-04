import PremiumHome from '@/features/PremiumHome';
import HomeDynamicSections from '@/features/home/HomeDynamicSections';

export default function Home() {
  return (
    <div className="premium-home">
      <PremiumHome />
      <HomeDynamicSections />
    </div>
  );
}
