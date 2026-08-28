/**
 * Historical entry point for the vision path.
 *
 * The transport moved to `lib/llm/client.ts` and the reading to `lib/llm/meal.ts`
 * when a second modality arrived. This file stays as the door its callers and
 * its test suite already know, so that split cost no churn anywhere else.
 */
export {
  PROVIDERS,
  VISION_PROVIDER_ORDER,
  MAX_REQUEST_BYTES,
  LlmError as VisionError,
  configuredProviders,
  fitsInRequest,
  mentionsJson,
  resolveEndpoint,
  testProvider,
  type ConfiguredProvider,
  type LlmErrorKind as VisionErrorKind,
  type Modality,
  type ProviderDefinition,
} from '@/lib/llm/client'

export {
  analyseMealPhoto as analyseMeal,
  analyseMealText,
  analysePhotoWithProvider as analyseWithProvider,
  type AnalyseInput,
  type AnalyseOutcome,
} from '@/lib/llm/meal'
