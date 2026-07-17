'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { CalendarDays, Clock, Sunrise } from 'lucide-react';
import PromoAdModal, {
  type PromoAdModalMetaItem,
} from '@/shared/ui/modals/PromoAdModal';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';

type Props = {
  open: boolean;
  onClose: () => void;
  onRemindTomorrow?: () => void;
};

export default function DailyPrayerAdModal({
  open,
  onClose,
  onRemindTomorrow,
}: Props) {
  const router = useRouter();

  const meta = useMemo<PromoAdModalMetaItem[]>(
    () => [
      { icon: CalendarDays, label: SERVICE_INFO.dailyPrayer.days },
      {
        icon: Clock,
        label: `${SERVICE_INFO.dailyPrayer.time} ${SERVICE_INFO.dailyPrayer.timezone}`,
      },
    ],
    []
  );

  const handleJoin = () => {
    router.push('/events/weekly');
  };

  return (
    <PromoAdModal
      open={open}
      onClose={onClose}
      onSecondaryAction={onRemindTomorrow}
      badgeLabel="Daily Prayer"
      badgeIcon={Sunrise}
      liveIndicator
      title="Daily Morning Prayer"
      headline="Start your day with us"
      description="Before the day gets loud, gather with us in prayer, declaration, and the Word — every weekday morning, in person or by livestream."
      iconFallback={Sunrise}
      meta={meta}
      primaryCtaLabel="Join us"
      onPrimaryAction={handleJoin}
      secondaryCtaLabel={onRemindTomorrow ? 'Remind me tomorrow' : undefined}
      note="Takes 45 minutes — a solid start before your day begins."
    />
  );
}
