// Auto-generated Elysia routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Elysia } from 'elysia'
import { api, debug, health } from './controller'

/**
 * Elysia plugin containing all generated routes.
 * Usage: app.use(routerPlugin)
 */
export const routerPlugin = new Elysia()
  .post('/api/admin/projects/bulk-delete', ({ body }) =>
    api.admin.projects.bulk_delete.handlePost({ body }),
  )
  .get('/api/admin/projects/count', () =>
    api.admin.projects.count.handleGet({}),
  )
  .get('/api/admin/projects/list', ({ query }) =>
    api.admin.projects.list.handleGet({ query }),
  )
  .get('/api/admin/usage/overview', ({ query }) =>
    api.admin.usage.overview.handleGet({ query }),
  )
  .post('/api/agent-run/:agent_run_id', ({ params }) =>
    api.agent_run._agent_run_id.handlePost({ params }),
  )
  .post('/api/agent-run/:agent_run_id/stop', ({ params }) =>
    api.agent_run._agent_run_id.stop.handlePost({ params }),
  )
  .get('/api/agent-run/:agent_run_id/stream', ({ params }) =>
    api.agent_run._agent_run_id.stream.handleGet({ params }),
  )
  .post('/api/agent/quick-start', ({ body }) =>
    api.agent.quick_start.handlePost({ body }),
  )
  .post('/api/ai-presenter/avatar', ({ body }) =>
    api.ai_presenter.avatar.handlePost({ body }),
  )
  .post('/api/ai-presenter/generate_video', ({ body }) =>
    api.ai_presenter.generate_video.handlePost({ body }),
  )
  .get('/api/ai-presenter/list', () => api.ai_presenter.list.handleGet({}))
  .get('/api/ai-presenter/presentation_info/:project_id', ({ params }) =>
    api.ai_presenter.presentation_info._project_id.handleGet({ params }),
  )
  .post('/api/ai-presenter/training', ({ body }) =>
    api.ai_presenter.training.handlePost({ body }),
  )
  .post('/api/ai-presenter/tts', ({ body }) =>
    api.ai_presenter.tts.handlePost({ body }),
  )
  .get('/api/ai-presenter/video_status/:video_id', ({ params }) =>
    api.ai_presenter.video_status._video_id.handleGet({ params }),
  )
  .get('/api/auth/google/callback', ({ query }) =>
    api.auth.google.callback.handleGet({ query }),
  )
  .post('/api/auth/google/initiate', () =>
    api.auth.google.initiate.handlePost({}),
  )
  .post('/api/connectors/:connector_id/authorize', ({ params, body }) =>
    api.connectors._connector_id.authorize.handlePost({ params, body }),
  )
  .get('/api/connectors/:connector_id/callback', ({ params, query }) =>
    api.connectors._connector_id.callback.handleGet({ params, query }),
  )
  .get(
    '/api/connectors/:connector_id/documents/:document_id',
    ({ params, query }) =>
      api.connectors._connector_id.documents._document_id.handleGet({
        params,
        query,
      }),
  )
  .get('/api/connectors/:connector_id/files', ({ params, query }) =>
    api.connectors._connector_id.files.handleGet({ params, query }),
  )
  .post('/api/connectors/:connector_id/files', ({ params, body }) =>
    api.connectors._connector_id.files.handlePost({ params, body }),
  )
  .get('/api/connectors/:connector_id/files/search', ({ params, query }) =>
    api.connectors._connector_id.files.search.handleGet({ params, query }),
  )
  .get('/api/connectors/activity', ({ query }) =>
    api.connectors.activity.handleGet({ query }),
  )
  .post('/api/connectors/approve', ({ body }) =>
    api.connectors.approve.handlePost({ body }),
  )
  .post('/api/connectors/disconnect', ({ body }) =>
    api.connectors.disconnect.handlePost({ body }),
  )
  .post('/api/connectors/execute', ({ body }) =>
    api.connectors.execute.handlePost({ body }),
  )
  .get('/api/connectors/list', () => api.connectors.list.handleGet({}))
  .get('/api/debug/config/llm', () => api.debug.config.llm.handleGet({}))
  .post('/api/debug/contracts/disable', ({ query }) =>
    api.debug.contracts.disable.handlePost({ query }),
  )
  .post('/api/debug/contracts/enable', ({ query }) =>
    api.debug.contracts.enable.handlePost({ query }),
  )
  .get('/api/debug/contracts/schemas', () =>
    api.debug.contracts.schemas.handleGet({}),
  )
  .get('/api/debug/contracts/schemas/:schema_path', ({ params }) =>
    api.debug.contracts.schemas._schema_path.handleGet({ params }),
  )
  .get('/api/debug/contracts/status', () =>
    api.debug.contracts.status.handleGet({}),
  )
  .post('/api/debug/contracts/toggle', ({ query }) =>
    api.debug.contracts.toggle.handlePost({ query }),
  )
  .post(
    '/api/debug/contracts/validate/api/:domain/:operation',
    ({ params, body }) =>
      api.debug.contracts.validate.api._domain._operation.handlePost({
        params,
        body,
      }),
  )
  .post(
    '/api/debug/contracts/validate/entity/:entity_type',
    ({ params, body }) =>
      api.debug.contracts.validate.entity._entity_type.handlePost({
        params,
        body,
      }),
  )
  .post('/api/debug/contracts/validate/tool-call', ({ body }) =>
    api.debug.contracts.validate.tool_call.handlePost({ body }),
  )
  .post('/api/debug/contracts/validate/tool-result', ({ body }) =>
    api.debug.contracts.validate.tool_result.handlePost({ body }),
  )
  .get('/api/debug/environment', () => api.debug.environment.handleGet({}))
  .post('/api/debug/frontend-logs', ({ body }) =>
    api.debug.frontend_logs.handlePost({ body }),
  )
  .post('/api/debug/test/agent-run', ({ body }) =>
    api.debug.test.agent_run.handlePost({ body }),
  )
  .post('/api/debug/test/extract-file', ({ query, body }) =>
    api.debug.test.extract_file.handlePost({ query, body }),
  )
  .get('/api/debug/test/extractors', () =>
    api.debug.test.extractors.handleGet({}),
  )
  .post('/api/favorites/add', ({ body }) =>
    api.favorites.add.handlePost({ body }),
  )
  .post('/api/favorites/count', ({ body }) =>
    api.favorites.count.handlePost({ body }),
  )
  .post('/api/favorites/list', ({ body }) =>
    api.favorites.list.handlePost({ body }),
  )
  .post('/api/favorites/remove', ({ body }) =>
    api.favorites.remove.handlePost({ body }),
  )
  .post('/api/favorites/toggle', ({ body }) =>
    api.favorites.toggle.handlePost({ body }),
  )
  .get('/api/health-check', () => api.health_check.handleGet({}))
  .head('/api/health-check', () => api.health_check.handleHead({}))
  .post('/api/memory/add', ({ body }) => api.memory.add.handlePost({ body }))
  .post('/api/memory/delete', ({ body }) =>
    api.memory.delete.handlePost({ body }),
  )
  .post('/api/memory/list', () => api.memory.list.handlePost({}))
  .post('/api/memory/search', ({ body }) =>
    api.memory.search.handlePost({ body }),
  )
  .post('/api/memory/update', ({ body }) =>
    api.memory.update.handlePost({ body }),
  )
  .post('/api/memory/upload-document', ({ query, body }) =>
    api.memory.upload_document.handlePost({ query, body }),
  )
  .post('/api/message/add', ({ body }) => api.message.add.handlePost({ body }))
  .post('/api/message/add-chart', ({ body }) =>
    api.message.add_chart.handlePost({ body }),
  )
  .post('/api/message/add-theme', ({ body }) =>
    api.message.add_theme.handlePost({ body }),
  )
  .post('/api/message/list', ({ body }) =>
    api.message.list.handlePost({ body }),
  )
  .get('/api/project/:project_id/files', ({ params, query }) =>
    api.project._project_id.files.handleGet({ params, query }),
  )
  .post('/api/project/:project_id/files', ({ params, body }) =>
    api.project._project_id.files.handlePost({ params, body }),
  )
  .delete('/api/project/:project_id/files', ({ params, query }) =>
    api.project._project_id.files.handleDelete({ params, query }),
  )
  .post('/api/project/:project_id/files/batch-download', ({ params, body }) =>
    api.project._project_id.files.batch_download.handlePost({ params, body }),
  )
  .get('/api/project/:project_id/files/content', ({ params, query, headers }) =>
    api.project._project_id.files.content.handleGet({ params, query, headers }),
  )
  .get('/api/project/:project_id/files/docx', ({ params, query, headers }) =>
    api.project._project_id.files.docx.handleGet({ params, query, headers }),
  )
  .get('/api/project/:project_id/files/preview', ({ params, query }) =>
    api.project._project_id.files.preview.handleGet({ params, query }),
  )
  .get(
    '/api/project/:project_id/files/preview/stream',
    ({ params, query, headers }) =>
      api.project._project_id.files.preview.stream.handleGet({
        params,
        query,
        headers,
      }),
  )
  .get('/api/project/:project_id/files/url', ({ params }) =>
    api.project._project_id.files.url.handleGet({ params }),
  )
  .post(
    '/api/project/:project_id/onedrive/export',
    ({ params, headers, body }) =>
      api.project._project_id.onedrive.export.handlePost({
        params,
        headers,
        body,
      }),
  )
  .get('/api/project/:project_id/presentation', ({ params, query, headers }) =>
    api.project._project_id.presentation.handleGet({ params, query, headers }),
  )
  .get(
    '/api/project/:project_id/presentation/:sub_folder_path',
    ({ params, query, headers }) =>
      api.project._project_id.presentation._sub_folder_path.handleGet({
        params,
        query,
        headers,
      }),
  )
  .get('/api/project/:project_id/sandbox/url', ({ params, query }) =>
    api.project._project_id.sandbox.url.handleGet({ params, query }),
  )
  .get('/api/project/:project_id/webappfiles', ({ params }) =>
    api.project._project_id.webappfiles.handleGet({ params }),
  )
  .post('/api/project/bulk-delete', ({ body }) =>
    api.project.bulk_delete.handlePost({ body }),
  )
  .post('/api/project/create', ({ body }) =>
    api.project.create.handlePost({ body }),
  )
  .post('/api/project/delete', ({ body }) =>
    api.project.delete.handlePost({ body }),
  )
  .post('/api/project/get', ({ body }) => api.project.get.handlePost({ body }))
  .post('/api/project/list', () => api.project.list.handlePost({}))
  .post('/api/project/update', ({ body }) =>
    api.project.update.handlePost({ body }),
  )
  .get('/api/projects/:project_id/files/info', ({ params, query }) =>
    api.projects._project_id.files.info.handleGet({ params, query }),
  )
  .post('/api/projects/:project_id/files/upload', ({ params, body }) =>
    api.projects._project_id.files.upload.handlePost({ params, body }),
  )
  .post('/api/share/project/get', ({ body }) =>
    api.share.project.get.handlePost({ body }),
  )
  .post('/api/share/thread/get', ({ body }) =>
    api.share.thread.get.handlePost({ body }),
  )
  .post('/api/suggestions/generate', ({ body }) =>
    api.suggestions.generate.handlePost({ body }),
  )
  .post('/api/thread/:thread_id/agent-runs', ({ params }) =>
    api.thread._thread_id.agent_runs.handlePost({ params }),
  )
  .post('/api/thread/:thread_id/agent/start', ({ params, body }) =>
    api.thread._thread_id.agent.start.handlePost({ params, body }),
  )
  .post('/api/thread/create', ({ body }) =>
    api.thread.create.handlePost({ body }),
  )
  .post('/api/thread/get', ({ body }) => api.thread.get.handlePost({ body }))
  .post('/api/thread/list', ({ body }) => api.thread.list.handlePost({ body }))
  .post('/api/thread/search', ({ body }) =>
    api.thread.search.handlePost({ body }),
  )
  .post('/api/tools/check-video-status', ({ body }) =>
    api.tools.check_video_status.handlePost({ body }),
  )
  .get('/api/tools/list', () => api.tools.list.handleGet({}))
  .get('/api/triggers', () => api.triggers.handleGet({}))
  .post('/api/triggers', ({ body }) => api.triggers.handlePost({ body }))
  .get('/api/triggers/:trigger_id', ({ params }) =>
    api.triggers._trigger_id.handleGet({ params }),
  )
  .post('/api/triggers/:trigger_id', ({ params, body }) =>
    api.triggers._trigger_id.handlePost({ params, body }),
  )
  .post('/api/triggers/:trigger_id/delete', ({ params }) =>
    api.triggers._trigger_id.delete.handlePost({ params }),
  )
  .post('/api/triggers/:trigger_id/toggle', ({ params, body }) =>
    api.triggers._trigger_id.toggle.handlePost({ params, body }),
  )
  .post('/api/triggers/createScheduledTaskWithPrompt', ({ body }) =>
    api.triggers.createScheduledTaskWithPrompt.handlePost({ body }),
  )
  .post('/api/triggers/webhook', () => api.triggers.webhook.handlePost({}))
  .get('/api/usage/admin/daily', ({ query }) =>
    api.usage.admin.daily.handleGet({ query }),
  )
  .get('/api/usage/admin/events', ({ query }) =>
    api.usage.admin.events.handleGet({ query }),
  )
  .get('/api/usage/admin/export', ({ query }) =>
    api.usage.admin.export.handleGet({ query }),
  )
  .get('/api/usage/admin/overview', ({ query }) =>
    api.usage.admin.overview.handleGet({ query }),
  )
  .get('/api/usage/admin/pricing', () => api.usage.admin.pricing.handleGet({}))
  .get('/api/usage/admin/quota', () => api.usage.admin.quota.handleGet({}))
  .get('/api/user/check-owner', () => api.user.check_owner.handleGet({}))
  .post('/api/user/create', () => api.user.create.handlePost({}))
  .post('/api/user/cred', () => api.user.cred.handlePost({}))
  .post('/api/user/delete-personal-data', () =>
    api.user.delete_personal_data.handlePost({}),
  )
  .get('/api/user/export-personal-data', () =>
    api.user.export_personal_data.handleGet({}),
  )
  .get('/api/user/gdpr-consent', () => api.user.gdpr_consent.handleGet({}))
  .post('/api/user/gdpr-consent', ({ body }) =>
    api.user.gdpr_consent.handlePost({ body }),
  )
  .post('/api/user/get', () => api.user.get.handlePost({}))
  .get('/api/user/preferences/file-summarization', () =>
    api.user.preferences.file_summarization.handleGet({}),
  )
  .post('/api/user/preferences/file-summarization', ({ body }) =>
    api.user.preferences.file_summarization.handlePost({ body }),
  )
  .get('/api/user/skills', () => api.user.skills.handleGet({}))
  .get('/api/user/skills/:skill_name', ({ params }) =>
    api.user.skills._skill_name.handleGet({ params }),
  )
  .delete('/api/user/skills/:skill_name', ({ params }) =>
    api.user.skills._skill_name.handleDelete({ params }),
  )
  .post('/api/user/skills/toggle', ({ body }) =>
    api.user.skills.toggle.handlePost({ body }),
  )
  .post('/api/user/skills/upload', ({ body }) =>
    api.user.skills.upload.handlePost({ body }),
  )
  .post('/api/user/update-throttle-rule', ({ body }) =>
    api.user.update_throttle_rule.handlePost({ body }),
  )
  .get('/api/version', () => api.version.handleGet({}))
  .get('/api/workflow/:workflow_id/details', ({ params }) =>
    api.workflow._workflow_id.details.handleGet({ params }),
  )
  .get('/api/workflow/list', () => api.workflow.list.handleGet({}))
  .get('/debug', () => debug.handleGet({}))
  .get('/debug/agent-runs/:agent_run_id/analysis', ({ params, query }) =>
    debug.agent_runs._agent_run_id.analysis.handleGet({ params, query }),
  )
  .get('/debug/agent-runs/:agent_run_id/events', ({ params, query }) =>
    debug.agent_runs._agent_run_id.events.handleGet({ params, query }),
  )
  .get('/debug/agent-runs/:agent_run_id/traces', ({ params, query }) =>
    debug.agent_runs._agent_run_id.traces.handleGet({ params, query }),
  )
  .post('/debug/chat', ({ body }) => debug.chat.handlePost({ body }))
  .get('/debug/chat/suggestions', () => debug.chat.suggestions.handleGet({}))
  .get('/debug/critical-issues', () => debug.critical_issues.handleGet({}))
  .get('/debug/errors', () => debug.errors.handleGet({}))
  .post('/debug/events', ({ body }) => debug.events.handlePost({ body }))
  .post('/debug/frontend-logs', () => debug.frontend_logs.handlePost({}))
  .get('/debug/frontend-telemetry', ({ query }) =>
    debug.frontend_telemetry.handleGet({ query }),
  )
  .post('/debug/frontend-telemetry', () =>
    debug.frontend_telemetry.handlePost({}),
  )
  .get('/debug/threads', () => debug.threads.handleGet({}))
  .get('/debug/threads/:thread_id/agent-runs', ({ params, query }) =>
    debug.threads._thread_id.agent_runs.handleGet({ params, query }),
  )
  .get('/debug/threads/:thread_id/events', ({ params, query }) =>
    debug.threads._thread_id.events.handleGet({ params, query }),
  )
  .get('/debug/threads/:thread_id/traces', ({ params, query }) =>
    debug.threads._thread_id.traces.handleGet({ params, query }),
  )
  .post('/debug/threads/register', () => debug.threads.register.handlePost({}))
  .get('/debug/timeline/:thread_id', ({ params }) =>
    debug.timeline._thread_id.handleGet({ params }),
  )
  .get('/health', () => health.handleGet({}))

export default routerPlugin
