export const CURRENT_MODEL = 'qwen2.5-coder:32b';

export interface ModelConfig {
  name: string;
  displayName: string;
  description: string;
}

export const MODEL_CONFIG: ModelConfig = {
  name: CURRENT_MODEL,
  displayName: 'Qwen 2.5 Coder',
  description: 'Specialized for code generation and technical discussions',
};