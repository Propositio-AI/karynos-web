/**
 * Types for Dreamer API requests and responses
 * Generated from the provided JSON schema in the user request.
 */

/** Dreamer group item in DreamerResponse */
export type DreamerGroupItem = {
  /** グループ名 */
  name: string;
  /** グループID (UUID7) */
  group_id: string;
};

/** Request to create a new Dreamer */
export type NewDreamerRequest = {
  /** 団体ID */
  organization_id: number;
  /** 苗字 */
  name_family: string;
  /** 名前 */
  name_given: string;
};

/** Response after creating a new Dreamer */
export type NewDreamerResponse = {
  /** Dreamer ID (UUID) */
  dreamer_id: string;
};

/** Request to update Dreamer information (all fields optional) */
export type UpdateDreamerRequest = {
  /** 団体ID */
  organization_id?: number;
  /** 苗字 */
  name_family?: string;
  /** 名前 */
  name_given?: string;
};

/** Dreamer information response */
export type DreamerResponse = {
  /** ログイン用ID */
  login_id: string;
  /** 団体ID */
  organization_id: number;
  /** 苗字 */
  name_family: string;
  /** 名前 */
  name_given: string;
  /** 所属しているDreamerグループの一覧 */
  groups: DreamerGroupItem[];
};

/** Request to create a new Dreamer Group */
export type NewDreamerGroupRequest = {
  /** グループ名 */
  name: string;
  /** グループの説明 */
  description: string;
  /** 初期グループDreamerのIDリスト (UUID7) */
  dreamers: string[];
};

/** Response after creating a new Dreamer Group */
export type NewDreamerGroupResponse = {
  /** グループID (UUID7) */
  group_id: string;
};

/** Dreamer member item in DreamerGroupResponse */
export type DreamerMemberItem = {
  /** Dreamer名 */
  name: string;
  /** Dreamer ID (UUID7) */
  dreamer_id: string;
};

/** Dreamer Group information response */
export type DreamerGroupResponse = {
  /** グループ名 */
  name: string;
  /** グループの説明 */
  description: string;
  /** グループメンバーのIDリスト */
  dreamers: DreamerMemberItem[];
};

/** Request to update Dreamer Group information (all fields optional) */
export type UpdateDreamerGroupRequest = {
  /** グループ名 */
  name?: string;
  /** グループの説明 */
  description?: string;
};

/** Request to add/update Dreamers to a Group */
export type DreamerToGroupRequest = {
  /** 更新したいDreamer IDのリスト (UUID) */
  dreamers: string[];
};

/** Response after adding/updating Dreamers to a Group */
export type DreamerToGroupResponse = {
  /** 更新後のDreamer IDのリスト (UUID) */
  dreamers: string[];
};
