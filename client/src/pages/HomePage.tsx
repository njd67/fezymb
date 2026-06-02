import { PageContainer } from '../components/layout/PageContainer';
import { FeatureTile } from '../components/ui/FeatureTile';
import { PageHeader } from '../components/typography/PageHeader';
import { HeroActions, HeroCard, HomeRoot, TileGrid } from './HomePage.styles';

const homeTiles = [
  {
    to: '/upload/csv',
    title: 'Fleet data in seconds',
    description:
      'Import maintenance CSVs without spreadsheet chaos. Work orders, parts, and timesheets—guided from selection to upload.',
    moreInfo:
      'Pick a dataset type, map columns if needed, and hand off to the upload API. Built for repeat fleet imports with validation at each step.',
    cta: 'Start CSV upload →',
  },
  {
    to: '/upload/pdf',
    title: 'Manuals that talk back',
    description:
      'Upload AMM chapters, IPC sections, and work packages. Multi-file batches with category metadata built in.',
    moreInfo:
      'Tag each file with manual type and chapter so downstream search and RAG pipelines know what they are reading.',
    cta: 'Start PDF upload →',
  },
  {
    to: '/upload/csv',
    title: 'Step-by-step, not guesswork',
    description:
      'Every upload path shows all steps at once—unlock each section as you go, with box selectors and dropzones.',
    moreInfo:
      'Technicians see the full journey upfront. Completed steps unlock the next panel—no hidden wizard screens.',
    cta: 'See guided flow →',
  },
  {
    to: '/upload/pdf',
    title: 'Real uploads, swap-ready API',
    description:
      'Files land on a local Express stub today. Same client service signatures when you move to S3 or your production API.',
    moreInfo:
      'Swap the server target without touching the React client—`uploadService` keeps the same request shape.',
    cta: 'Try PDF upload →',
  },
  {
    to: '/logs',
    title: 'Maintenance log capture',
    description:
      'Record from the mic, ingest on stop, and poll your FastAPI service until structured fields are ready to commit.',
    moreInfo:
      'Audio uploads on stop; status polling fills ATA codes, squawks, and parts used before you commit the log.',
    cta: 'Start log capture →',
  },
  {
    to: '/troubleshoot',
    title: 'Smart troubleshooting',
    description:
      'Select an aircraft, describe a fault, and search historical maintenance records for root-cause insights and fix-time estimates.',
    moreInfo:
      'Matches similar faults across your fleet history and surfaces suggested parts plus fix-time comparisons.',
    cta: 'Open troubleshoot →',
  },
] as const;

export function HomePage() {
  return (
    <PageContainer>
      <HomeRoot>
        <HeroCard>
          <PageHeader
            title="Upload infrastructure for"
            gradientPhrase="aircraft maintenance"
            gradientTone="purple"
            subtitle="CSV and PDF workflows, ready for your team."
            subtext="Zymbly's upload portal walks technicians through every step—dataset selection, file validation, and server handoff—so you can plug in real processing later."
          />
        </HeroCard>
        <TileGrid>
          {homeTiles.map((tile) => (
            <FeatureTile key={tile.title} {...tile} />
          ))}
        </TileGrid>
        <HeroActions />
      </HomeRoot>
    </PageContainer>
  );
}
