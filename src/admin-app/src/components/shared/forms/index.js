/**
 * @file index.js
 * @summary Barrel for shared form-dialog components used across features.
 *
 * Both ChallengeForm and TemplateForm need to create new actions and
 * categories on the fly, so the dialogs live here instead of nested
 * under one feature folder.
 */

export { default as ActionFormDialog } from "./ActionFormDialog";
export { default as CategoryFormDialog } from "./CategoryFormDialog";
