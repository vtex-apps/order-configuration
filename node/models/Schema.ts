export interface Schema {
  'v-cache': boolean;
  properties: Record<string, { type: string}>;
  'v-default-fields': string[];
  'v-indexed': string[];
}
