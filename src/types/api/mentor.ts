/**
 * Types for Mentor API requests and responses
 * Generated from the provided JSON schema in the user request.
 */

/** Mentor group item in MentorResponse */
export type MentorGroupItem = {
  /** グループ名 */
  name: string;
  /** グループID (UUID7) */
  group_id: string;
};

/** Request to create a new Mentor */
export type NewMentorRequest = {
  /** チーフメンターのID (UUID7) */
  chief_mentor_id: string;
  /** 団体ID */
  organization_id: number;
  /** 苗字 */
  name_family: string;
  /** 名前 */
  name_given: string;
  /** アクセスグループのID (UUID7) */
  access_group: string;
};

/** Response after creating a new Mentor */
export type NewMentorResponse = {
  /** Mentor ID (UUID) */
  mentor_id: string;
};

/** Mentor information response */
export type MentorResponse = {
  /** ログイン用ID */
  login_id: string;
  /** チーフメンターのID (UUID7) */
  chief_mentor_id: string;
  /** 団体ID */
  organization_id: number;
  /** 苗字 */
  name_family: string;
  /** 名前 */
  name_given: string;
  /** アクセスグループのID (UUID7) */
  access_group: string;
  /** 所属しているMentorグループの一覧 */
  group: MentorGroupItem[];
};

/** Request to update Mentor information (all fields optional) */
export type UpdateMentorRequest = {
  /** チーフメンターのID (UUID7) */
  chief_mentor_id?: string;
  /** 団体ID */
  organization_id?: number;
  /** 苗字 */
  name_family?: string;
  /** 名前 */
  name_given?: string;
  /** アクセスグループのID (UUID7) */
  access_group?: string;
};

/** Request to create a new Mentor Group */
export type NewMentorGroupRequest = {
  /** グループチーフメンターのID (UUID7) */
  chief_mentor_id: string;
  /** グループ名 */
  name: string;
  /** グループの説明 */
  description: string;
  /** 初期グループメンバーのIDリスト (UUID7) - Note: typo 'memtors' in original schema */
  mentors: string[];
};

/** Response after creating a new Mentor Group */
export type NewMentorGroupResponse = {
  /** グループID (UUID7) */
  group_id: string;
};

/** Mentor member item in MentorGroupResponse */
export type MentorMemberItem = {
  /** Mentor名 */
  name: string;
  /** Mentor ID (UUID7) */
  mentor_id: string;
};

/** Mentor Group information response */
export type MentorGroupResponse = {
  /** グループチーフメンターのID (UUID7) */
  chief_mentor_id: string;
  /** グループ名 */
  name: string;
  /** グループの説明 */
  description: string;
  /** グループメンバーのIDリスト */
  mentors: MentorMemberItem[];
};

/** Request to update Mentor Group information (all fields optional) */
export type UpdateMentorGroupRequest = {
  /** グループチーフメンターのID (UUID7) */
  chief_mentor_id?: string;
  /** グループ名 */
  name?: string;
  /** グループの説明 */
  description?: string;
};

/** Mentor item with role for MentorToGroup operations */
export type MentorWithRole = {
  /** Mentor ID (UUID) */
  mentor_id: string;
  /** 役割 (※メンター時のみ) */
  role: string;
};

/** Request to add/update Mentors to a Group */
export type MentorToGroupRequest = {
  /** 更新したいMentorIDのリスト */
  mentors: MentorWithRole[];
};

/** Response after adding/updating Mentors to a Group */
export type MentorToGroupResponse = {
  /** 更新後のMentorIDのリスト */
  mentors: MentorWithRole[];
};
