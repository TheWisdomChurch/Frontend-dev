import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const violations = [];

const forbiddenRootFiles = [
  'ANALYTICS_CONFIGURATION.ts',
  'ANALYTICS_EXAMPLES.tsx',
  'C\uf03aTempeslint-full.txt',
];

for (const file of forbiddenRootFiles) {
  if (existsSync(join(root, file))) {
    violations.push(
      `${file}: generated, diagnostic, or example code must not live at the repository root`
    );
  }
}

function filesBelow(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap(entry => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? filesBelow(path) : [path];
  });
}

const legacyAnalytics = filesBelow(join(root, 'src/lib/analytics'));
for (const file of legacyAnalytics) {
  violations.push(
    `${relative(root, file)}: analytics belongs in src/shared/analytics`
  );
}

const sourceFiles = filesBelow(join(root, 'src')).filter(file =>
  /\.(?:ts|tsx)$/.test(file)
);

const editorialFeatureFiles = new Set([
  'src/features/Conversations.tsx',
  'src/features/events/EventsShowcase.tsx',
  'src/features/events/JoinUs.tsx',
  'src/features/events/OnlineGiving.tsx',
  'src/features/resources/Resource.tsx',
  'src/features/resources/Sermons/SermonLibrary.tsx',
  'src/features/testimonials/HomeTestimonials.tsx',
  'src/shared/ui/forms/eventsForm/PastoralCare.tsx',
]);

const publicPresentationFiles = new Set([
  ...editorialFeatureFiles,
  'src/features/PremiumHome.tsx',
  'src/app/resources/blogs/BlogSubscribeForm.tsx',
]);

for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  const displayPath = relative(root, file);
  const normalizedSource = source.replace(/^\uFEFF/, '').trimStart();
  const isClientComponent = /['"]use client['"]/.test(
    normalizedSource.slice(0, 512)
  );

  if (source.trim().length === 0) {
    violations.push(`${displayPath}: empty source files are not allowed`);
  }

  if (editorialFeatureFiles.has(displayPath)) {
    if (/from\s+['"]@\/shared\/layout['"]/.test(source)) {
      violations.push(
        `${displayPath}: public-facing feature sections must compose the editorial system, not legacy layout primitives`
      );
    }
    if (/SectionGlow|GridBackground/.test(source)) {
      violations.push(
        `${displayPath}: public-facing feature sections must not restore retired glow/grid decoration`
      );
    }
  }

  const isPublicPresentation =
    displayPath.startsWith('src/app/') ||
    displayPath.startsWith('src/features/') ||
    displayPath.startsWith('src/shared/ui/forms/') ||
    publicPresentationFiles.has(displayPath);
  if (isPublicPresentation) {
    const rawPalette =
      /(?:bg|text|border|ring|shadow)-(?:stone|amber|rose|emerald|red|gray|zinc|neutral|slate)-\d+/;
    const rawColor = /#[0-9a-fA-F]{3,8}|rgba?\(/;
    if (rawPalette.test(source) || rawColor.test(source)) {
      violations.push(
        `${displayPath}: public presentation must use semantic design tokens instead of raw palette or color values`
      );
    }
  }

  for (const match of source.matchAll(
    /['"`](\/(?:images|Picflow)\/[^'"`?#]+)['"`]/g
  )) {
    const publicAsset = join(root, 'public', match[1]);
    if (!existsSync(publicAsset)) {
      violations.push(
        `${displayPath}: referenced public asset does not exist: ${match[1]}`
      );
    }
  }

  if (
    /from\s+['"]@\/lib\/types['"]/.test(source) &&
    /\b(Product|CartItem|CustomerInfo|Order|YouTubeVideo|LeadershipMember|LeadershipRole)\b/.test(
      source
    )
  ) {
    violations.push(
      `${displayPath}: domain models must be imported from src/domain, not the legacy catch-all types module`
    );
  }

  const directFetchAllowed = new Set([
    'src/lib/http/client.ts',
    'src/app/api/v1/[...path]/route.ts',
  ]);
  if (/\bfetch\s*\(/.test(source) && !directFetchAllowed.has(displayPath)) {
    violations.push(
      `${displayPath}: backend calls must use the shared HTTP transport or a domain API adapter`
    );
  }

  if (displayPath.startsWith('src/app/') && /\.tsx$/.test(displayPath)) {
    const usesClientRuntime =
      /\b(useState|useEffect|useReducer|useContext|useRef|useRouter|usePathname|useSearchParams)\s*\(|\b(window|document)\./.test(
        source
      );
    if (usesClientRuntime && !isClientComponent) {
      violations.push(
        `${displayPath}: client runtime APIs require a top-level 'use client' directive`
      );
    }
    if (
      isClientComponent &&
      /\b(export\s+const\s+metadata|generateMetadata\s*\()/.test(source)
    ) {
      violations.push(
        `${displayPath}: metadata exports belong in a server component or route layout`
      );
    }

    if (/\/page\.tsx$/.test(displayPath)) {
      if (/<main\b/.test(source)) {
        violations.push(
          `${displayPath}: route page shells must use EditorialPage instead of handwritten main elements`
        );
      }
      if (
        /EditorialSection/.test(source) &&
        !/EditorialPage/.test(source) &&
        !/MinistryPageTemplate/.test(source)
      ) {
        violations.push(
          `${displayPath}: routes composing editorial sections must declare an EditorialPage shell`
        );
      }
      if (/from\s+['"]@\/shared\/layout['"]/.test(source)) {
        violations.push(
          `${displayPath}: route pages must use the editorial page system instead of the legacy shared layout primitives`
        );
      }
      if (/SectionGlow|GridBackground/.test(source)) {
        violations.push(
          `${displayPath}: route pages must not restore the retired glow/grid presentation architecture`
        );
      }
    }
  }
}

for (const boundary of ['src/app/error.tsx', 'src/app/global-error.tsx']) {
  const boundaryPath = join(root, boundary);
  if (!existsSync(boundaryPath)) {
    violations.push(
      `${boundary}: required application error boundary is missing`
    );
    continue;
  }
  const source = readFileSync(boundaryPath, 'utf8')
    .replace(/^\uFEFF/, '')
    .trimStart();
  if (!/['"]use client['"]/.test(source.slice(0, 512))) {
    violations.push(
      `${boundary}: Next.js error boundaries must be client components`
    );
  }
}

const tsconfig = readFileSync(join(root, 'tsconfig.json'), 'utf8');
if (/ANALYTICS_(CONFIGURATION|EXAMPLES)/.test(tsconfig)) {
  violations.push(
    'tsconfig.json: root-level analytics examples must not be compiled as application code'
  );
}

const layout = readFileSync(join(root, 'src/app/layout.tsx'), 'utf8');
if (/MetaPixel/.test(layout)) {
  violations.push(
    'src/app/layout.tsx: analytics vendors must be initialized only by AnalyticsProvider'
  );
}

if (violations.length > 0) {
  console.error('Architecture checks failed:\n');
  for (const violation of violations) console.error(`  - ${violation}`);
  process.exit(1);
}

console.log('Architecture checks passed.');
