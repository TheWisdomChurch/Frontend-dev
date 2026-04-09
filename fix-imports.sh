#!/bin/bash

# Fix imports mapping old paths to new paths

echo "Fixing imports..."

# Old -> New mappings
declare -A mappings=(
  ["@/components/ui/Homepage/heromain"]="@/components/features/hero/HeroMain"
  ["@/components/ui/Homepage/HeroHighlights"]="@/components/features/hero/HeroHighlights"
  ["@/components/ui/Homepage/EventsShowcase"]="@/components/features/events/EventsShowcase"
  ["@/components/ui/Homepage/Testimonials"]="@/components/features/testimonials/Testimonials"
  ["@/components/ui/Homepage/AssociatePastors"]="@/components/features/leadership/AssociatePastors"
  ["@/components/ui/Homepage/SeniorPastor"]="@/components/features/leadership/SeniorPastor"
  ["@/components/ui/Homepage/Resource"]="@/components/features/resources/Resource"
  ["@/components/ui/Homepage/JoinUs"]="@/components/features/events/JoinUs"
  ["@/components/ui/Homepage/OnlineGiving"]="@/components/features/events/OnlineGiving"
  ["@/components/ui/Homepage/WhatWeDo"]="@/components/features/WhatWeDo"
  ["@/components/ui/Homepage/EventAdModal"]="@/components/ui/modals/EventAdModal"
  ["@/components/ui/Homepage/PageHero"]="@/components/features/hero/PageHero"
  ["@/components/ui/PageHero"]="@/components/features/hero/PageHero"
  ["@/components/ui/ConfessionPopup"]="@/components/ui/modals/ConfessionPopup"
  ["@/components/ui/Layout/Header"]="@/components/common/Header"
  ["@/components/ui/Layout/Footer"]="@/components/common/Footer"
)

# Apply replacements
for old in "${!mappings[@]}"; do
  new="${mappings[$old]}"
  echo "Replacing $old -> $new"
  find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|$old|$new|g" {} +
done

echo "✅ Import fixes applied!"
