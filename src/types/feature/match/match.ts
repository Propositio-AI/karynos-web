export interface InitQuestion {
  question_id: string;
  category: string;
  question_text: string;
  question_order: number;
  version: number;
  options: InitOption[];
}

export interface InitOption {
  option_id: string;
  option_text: string;
  option_order: number;
}

export interface InitQuestionsResponse {
  questions: InitQuestion[];
  version: number;
  total_questions: number;
}

export interface InitAnswer {
  question_id: string;
  option_id: string;
  question_version: number;
}

export interface InitAnswerRequest {
  answers: InitAnswer[];
}

export interface InitAnswerResponse {
  total_saved: number;
  answers: InitAnswerDetail[];
}

export interface InitAnswerDetail {
  answer_id: string;
  dreamer_id: string;
  question_id: string;
  option_id: string;
  question_version: number;
  answered_at: string;
}

export interface InitAnswerHistory {
  answer_id: string;
  question_id: string;
  question_text: string;
  option_id: string;
  option_text: string;
  question_version: number;
  answered_at: string;
}
