import { PageHeader, Callout } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Types — wapi-cloud docs" };

export default function TypesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="TypeScript Types"
        description="Comprehensive TypeScript definitions exported by wapi-cloud — every client method, message option, template definition, commerce model, and webhook event is fully typed."
      />

      <Callout>
        All types below are exported directly from <code>wapi-cloud</code> root. You can import any type with <code>import type &#123; ... &#125; from &quot;wapi-cloud&quot;</code>.
      </Callout>

      <h2>Core Client & Response Types</h2>
      <CodeBlock
        filename="common.d.ts"
        lang="ts"
        code={`export interface WhatsappResponse<T> {
  data: T | null;
  error: WhatsappApiError | null;
  status: number;
  statusText: string;
  raw: unknown;
}

export interface WhatsappConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId?: string;
  appId?: string;
  appSecret?: string;
  businessId?: string;
  apiVersion?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
  maxRetries?: number;
  timeoutMs?: number;
  onRequest?: (info: { method: string; url: string }) => void;
  onResponse?: (info: { method: string; url: string; status: number }) => void;
}

export class WhatsappApiError extends Error {
  code: number;
  type: string;
  subcode?: number;
  fbtraceId?: string;
  httpStatus: number;
  isRetryable: boolean;
  raw: unknown;
}

export interface PageInfo {
  nextCursor?: string;
  previousCursor?: string;
  hasNext: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pageInfo: PageInfo;
}`}
      />

      <h2>Message Payload Types</h2>
      <CodeBlock
        filename="messages.d.ts"
        lang="ts"
        code={`export interface SendMessageResult {
  messageId: string;
  waId: string;
}

export interface TextMessageOptions {
  body: string;
  previewUrl?: boolean;
}

export interface MediaRef {
  link?: string;
  mediaId?: string;
  caption?: string;
  filename?: string;
}

export interface LocationMessageOptions {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface SendLocationRequestOptions {
  body: string;
}

export interface ContactMessageEntry {
  name: { formattedName: string; firstName?: string; lastName?: string };
  phones?: { phone: string; type?: "HOME" | "WORK"; waId?: string }[];
  emails?: { email: string; type?: "HOME" | "WORK" }[];
}

export interface InteractiveButton {
  id: string;
  title: string;
}

export interface InteractiveListRow {
  id: string;
  title: string;
  description?: string;
}

export interface InteractiveListSection {
  title?: string;
  rows: InteractiveListRow[];
}

export type SendInteractiveOptions =
  | { type: "button"; body: string; header?: string; footer?: string; buttons: InteractiveButton[] }
  | { type: "list"; body: string; header?: string; footer?: string; buttonText: string; sections: InteractiveListSection[] }
  | { type: "cta_url"; body: string; header?: string; footer?: string; displayText: string; url: string };

export interface SendFlowOptions {
  flowId: string;
  cta: string;
  headerText?: string;
  bodyText: string;
  footerText?: string;
  flowActionPayload?: { screen: string; data?: Record<string, unknown> };
}

export interface ReactionOptions {
  messageId: string;
  emoji: string;
}

export interface SendProductOptions {
  catalogId: string;
  productRetailerId: string;
  body?: string;
  footer?: string;
}

export interface ProductListSection {
  title: string;
  productRetailerIds: string[];
}

export interface SendProductListOptions {
  catalogId: string;
  header: string;
  body: string;
  footer?: string;
  sections: ProductListSection[];
}

export interface SendCatalogOptions {
  body: string;
  footer?: string;
  thumbnailProductRetailerId?: string;
}

export interface ProductCarouselCard {
  catalogId: string;
  productRetailerId: string;
}

export interface SendProductCarouselOptions {
  body: string;
  cards: ProductCarouselCard[];
}

export interface MediaCarouselCtaCard {
  type: "cta_url";
  headerType: "image" | "video";
  headerMedia: MediaRef;
  body?: string;
  displayText: string;
  url: string;
}

export interface MediaCarouselQuickReplyCard {
  type: "quick_reply";
  headerType: "image" | "video";
  headerMedia: MediaRef;
  body?: string;
  buttons: InteractiveButton[];
}

export type MediaCarouselCard = MediaCarouselCtaCard | MediaCarouselQuickReplyCard;

export interface SendMediaCarouselOptions {
  body: string;
  cards: MediaCarouselCard[];
}`}
      />

      <h2>Template & Component Types</h2>
      <CodeBlock
        filename="templates.d.ts"
        lang="ts"
        code={`export type TemplateCategory = "AUTHENTICATION" | "MARKETING" | "UTILITY";
export type TemplateStatus = "APPROVED" | "PENDING" | "REJECTED" | "PAUSED" | "DISABLED";

export interface TemplateButtonDefinition {
  type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER" | "SPM" | "FLOW";
  text?: string;
  url?: string;
  phone_number?: string;
  example?: string[];
  flow_id?: string;
  flow_name?: string;
  flow_action?: "navigate" | "data_exchange";
  navigate_screen?: string;
}

export interface TemplateComponentDefinition {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS" | "CALL_PERMISSION_REQUEST";
  format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "LOCATION" | "PRODUCT";
  text?: string;
  buttons?: TemplateButtonDefinition[];
  example?: Record<string, unknown>;
}

export interface CarouselCardComponentDefinition {
  type: "HEADER" | "BODY" | "BUTTONS";
  format?: "IMAGE" | "VIDEO";
  text?: string;
  buttons?: TemplateButtonDefinition[];
  example?: Record<string, unknown>;
}

export interface CarouselCardDefinition {
  components: CarouselCardComponentDefinition[];
}

export interface CarouselComponentDefinition {
  type: "CAROUSEL";
  cards: CarouselCardDefinition[];
}

export type AnyTemplateComponentDefinition = TemplateComponentDefinition | CarouselComponentDefinition;

export interface WhatsappTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  language: string;
  status: TemplateStatus;
  components: AnyTemplateComponentDefinition[];
  rejected_reason?: string;
}

export interface CreateTemplateInput {
  name: string;
  category: TemplateCategory;
  language: string;
  components: AnyTemplateComponentDefinition[];
  parameter_format?: "positional" | "named";
}

export interface UpdateTemplateInput {
  category?: TemplateCategory;
  components?: AnyTemplateComponentDefinition[];
}

export interface ListTemplatesParams {
  limit?: number;
  after?: string;
  before?: string;
  status?: TemplateStatus;
  name?: string;
}`}
      />

      <h2>Commerce & Catalog Types</h2>
      <CodeBlock
        filename="commerce.d.ts"
        lang="ts"
        code={`export interface WhatsappCatalog {
  id: string;
  name: string;
  product_count?: number;
  vertical?: string;
}

export type ProductAvailability = "in stock" | "out of stock" | "preorder" | "available for order" | "discontinued";
export type ProductCondition = "new" | "refurbished" | "used";

export interface WhatsappProduct {
  id: string;
  retailer_id: string;
  name: string;
  description?: string;
  price?: string;
  currency?: string;
  image_url?: string;
  url?: string;
  availability?: ProductAvailability;
  condition?: ProductCondition;
  brand?: string;
  category?: string;
  visibility?: "published" | "staging";
}

export interface CreateProductInput {
  retailerId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl: string;
  url?: string;
  availability?: ProductAvailability;
  condition?: ProductCondition;
  brand?: string;
  category?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface CommerceSettings {
  is_catalog_visible: boolean;
  is_cart_enabled: boolean;
}

export interface UpdateCommerceSettingsInput {
  isCatalogVisible?: boolean;
  isCartEnabled?: boolean;
}`}
      />

      <h2>Webhooks & Event Types</h2>
      <CodeBlock
        filename="webhooks.d.ts"
        lang="ts"
        code={`export interface InboundMessageBase {
  id: string;
  from: string;
  timestamp: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
}

export type InboundMessageEvent =
  | (InboundMessageBase & { messageType: "text"; text: { body: string } })
  | (InboundMessageBase & { messageType: "image"; image: { id: string; mimeType: string; caption?: string } })
  | (InboundMessageBase & { messageType: "video"; video: { id: string; mimeType: string; caption?: string } })
  | (InboundMessageBase & { messageType: "audio"; audio: { id: string; mimeType: string } })
  | (InboundMessageBase & { messageType: "document"; document: { id: string; mimeType: string; filename?: string } })
  | (InboundMessageBase & { messageType: "sticker"; sticker: { id: string; mimeType: string } })
  | (InboundMessageBase & { messageType: "location"; location: { latitude: number; longitude: number; name?: string; address?: string } })
  | (InboundMessageBase & { messageType: "contacts"; contacts: unknown[] })
  | (InboundMessageBase & { messageType: "interactive"; interactive: { type: string; [key: string]: unknown } })
  | (InboundMessageBase & { messageType: "button"; button: { text: string; payload: string } })
  | (InboundMessageBase & { messageType: "reaction"; reaction: { messageId: string; emoji: string } })
  | (InboundMessageBase & { messageType: "unknown"; raw: unknown });

export interface MessageStatusEvent {
  type: "status";
  messageId: string;
  status: "sent" | "delivered" | "read" | "failed";
  recipientId: string;
  timestamp: string;
  phoneNumberId: string;
  errors?: { code: number; title: string }[];
}

export interface TemplateStatusUpdateEvent {
  type: "template_status_update";
  messageTemplateId: string;
  messageTemplateName: string;
  messageTemplateLanguage: string;
  event: string;
  reason?: string;
}

export interface AccountAlertEvent {
  type: "account_alert";
  raw: unknown;
}

export type WhatsappEvent =
  | ({ type: "message" } & InboundMessageEvent)
  | MessageStatusEvent
  | TemplateStatusUpdateEvent
  | AccountAlertEvent;`}
      />

      <h2>Account, Media & Flows Types</h2>
      <CodeBlock
        filename="modules.d.ts"
        lang="ts"
        code={`export interface MediaMetadata {
  id: string;
  url: string;
  mime_type: string;
  sha256: string;
  file_size: number;
  messaging_product: "whatsapp";
}

export interface ContactCheckResult {
  input: string;
  waId?: string;
  status: "valid" | "invalid";
}

export interface WhatsappPhoneNumber {
  id: string;
  display_phone_number: string;
  verified_name: string;
  quality_rating: string;
  code_verification_status: string;
}

export interface BusinessProfile {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  profile_picture_url?: string;
  websites?: string[];
  vertical?: string;
}

export interface UpdateBusinessProfileInput {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  websites?: string[];
  vertical?: string;
  profilePictureHandle?: string;
}

export interface WhatsappFlow {
  id: string;
  name: string;
  status: "DRAFT" | "PUBLISHED" | "DEPRECATED";
  categories: string[];
}

export type FlowCategory =
  | "SIGN_UP"
  | "SIGN_IN"
  | "APPOINTMENT_BOOKING"
  | "LEAD_GENERATION"
  | "CONTACT_US"
  | "CUSTOMER_SUPPORT"
  | "SURVEY"
  | "OTHER";

export interface CreateFlowInput {
  name: string;
  categories: FlowCategory[];
  flowJson?: object | string;
  cloneFlowId?: string;
  endpointUri?: string;
}

export interface WhatsappQrCode {
  code: string;
  prefilled_message: string;
  deep_link_url: string;
  qr_image_url?: string;
}

export interface AnalyticsQuery {
  start: Date | number;
  end: Date | number;
  granularity?: "HALF_HOUR" | "DAY" | "MONTH";
}

export interface ExchangedEmbeddedSignupToken {
  accessToken: string;
  tokenType: string;
}

export interface EmbeddedSignupLoginScriptOptions {
  appId: string;
  configId: string;
  graphApiVersion?: string;
  triggerElementId?: string;
}`}
      />
    </>
  );
}
