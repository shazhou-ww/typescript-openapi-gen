// Auto-generated Hono routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { api, debug, health } from './controller'

export const app = new Hono()

/**
 * Decorates a Hono app with generated routes.
 * Usage: const app = new Hono(); decorate(app);
 */
export function decorate<T extends Hono>(app: T): T {
  app.post('/api/admin/projects/bulk-delete', async (c) => {
    const body = await c.req.json()
    const result = await api.admin.projects.bulk_delete.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/admin/projects/count', async (c) => {
    const result = await api.admin.projects.count.handleGet({})
    return c.json(result)
  })
  app.get('/api/admin/projects/list', async (c) => {
    const query = c.req.query()
    const result = await api.admin.projects.list.handleGet({ query })
    return c.json(result)
  })
  app.get('/api/admin/usage/overview', async (c) => {
    const query = c.req.query()
    const result = await api.admin.usage.overview.handleGet({ query })
    return c.json(result)
  })
  app.post('/api/agent-run/:agent_run_id', async (c) => {
    const params = c.req.param()
    const result = await api.agent_run._agent_run_id.handlePost({ params })
    return c.json(result)
  })
  app.post('/api/agent-run/:agent_run_id/stop', async (c) => {
    const params = c.req.param()
    const result = await api.agent_run._agent_run_id.stop.handlePost({ params })
    return c.json(result)
  })
  app.get('/api/agent-run/:agent_run_id/stream', async (c) => {
    const params = c.req.param()
    const result = await api.agent_run._agent_run_id.stream.handleGet({
      params,
    })
    return c.json(result)
  })
  app.post('/api/agent/quick-start', async (c) => {
    const body = await c.req.json()
    const result = await api.agent.quick_start.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/ai-presenter/avatar', async (c) => {
    const body = await c.req.json()
    const result = await api.ai_presenter.avatar.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/ai-presenter/generate_video', async (c) => {
    const body = await c.req.json()
    const result = await api.ai_presenter.generate_video.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/ai-presenter/list', async (c) => {
    const result = await api.ai_presenter.list.handleGet({})
    return c.json(result)
  })
  app.get('/api/ai-presenter/presentation_info/:project_id', async (c) => {
    const params = c.req.param()
    const result =
      await api.ai_presenter.presentation_info._project_id.handleGet({ params })
    return c.json(result)
  })
  app.post('/api/ai-presenter/training', async (c) => {
    const body = await c.req.json()
    const result = await api.ai_presenter.training.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/ai-presenter/tts', async (c) => {
    const body = await c.req.json()
    const result = await api.ai_presenter.tts.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/ai-presenter/video_status/:video_id', async (c) => {
    const params = c.req.param()
    const result = await api.ai_presenter.video_status._video_id.handleGet({
      params,
    })
    return c.json(result)
  })
  app.get('/api/auth/google/callback', async (c) => {
    const query = c.req.query()
    const result = await api.auth.google.callback.handleGet({ query })
    return c.json(result)
  })
  app.post('/api/auth/google/initiate', async (c) => {
    const result = await api.auth.google.initiate.handlePost({})
    return c.json(result)
  })
  app.post('/api/connectors/:connector_id/authorize', async (c) => {
    const params = c.req.param()
    const body = await c.req.json()
    const result = await api.connectors._connector_id.authorize.handlePost({
      params,
      body,
    })
    return c.json(result)
  })
  app.get('/api/connectors/:connector_id/callback', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await api.connectors._connector_id.callback.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.get('/api/connectors/:connector_id/documents/:document_id', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result =
      await api.connectors._connector_id.documents._document_id.handleGet({
        params,
        query,
      })
    return c.json(result)
  })
  app.get('/api/connectors/:connector_id/files', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await api.connectors._connector_id.files.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.post('/api/connectors/:connector_id/files', async (c) => {
    const params = c.req.param()
    const body = await c.req.json()
    const result = await api.connectors._connector_id.files.handlePost({
      params,
      body,
    })
    return c.json(result)
  })
  app.get('/api/connectors/:connector_id/files/search', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await api.connectors._connector_id.files.search.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.get('/api/connectors/activity', async (c) => {
    const query = c.req.query()
    const result = await api.connectors.activity.handleGet({ query })
    return c.json(result)
  })
  app.post('/api/connectors/approve', async (c) => {
    const body = await c.req.json()
    const result = await api.connectors.approve.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/connectors/disconnect', async (c) => {
    const body = await c.req.json()
    const result = await api.connectors.disconnect.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/connectors/execute', async (c) => {
    const body = await c.req.json()
    const result = await api.connectors.execute.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/connectors/list', async (c) => {
    const result = await api.connectors.list.handleGet({})
    return c.json(result)
  })
  app.get('/api/debug/config/llm', async (c) => {
    const result = await api.debug.config.llm.handleGet({})
    return c.json(result)
  })
  app.post('/api/debug/contracts/disable', async (c) => {
    const query = c.req.query()
    const result = await api.debug.contracts.disable.handlePost({ query })
    return c.json(result)
  })
  app.post('/api/debug/contracts/enable', async (c) => {
    const query = c.req.query()
    const result = await api.debug.contracts.enable.handlePost({ query })
    return c.json(result)
  })
  app.get('/api/debug/contracts/schemas', async (c) => {
    const result = await api.debug.contracts.schemas.handleGet({})
    return c.json(result)
  })
  app.get('/api/debug/contracts/schemas/:schema_path', async (c) => {
    const params = c.req.param()
    const result = await api.debug.contracts.schemas._schema_path.handleGet({
      params,
    })
    return c.json(result)
  })
  app.get('/api/debug/contracts/status', async (c) => {
    const result = await api.debug.contracts.status.handleGet({})
    return c.json(result)
  })
  app.post('/api/debug/contracts/toggle', async (c) => {
    const query = c.req.query()
    const result = await api.debug.contracts.toggle.handlePost({ query })
    return c.json(result)
  })
  app.post(
    '/api/debug/contracts/validate/api/:domain/:operation',
    async (c) => {
      const params = c.req.param()
      const body = await c.req.json()
      const result =
        await api.debug.contracts.validate.api._domain._operation.handlePost({
          params,
          body,
        })
      return c.json(result)
    },
  )
  app.post('/api/debug/contracts/validate/entity/:entity_type', async (c) => {
    const params = c.req.param()
    const body = await c.req.json()
    const result =
      await api.debug.contracts.validate.entity._entity_type.handlePost({
        params,
        body,
      })
    return c.json(result)
  })
  app.post('/api/debug/contracts/validate/tool-call', async (c) => {
    const body = await c.req.json()
    const result = await api.debug.contracts.validate.tool_call.handlePost({
      body,
    })
    return c.json(result)
  })
  app.post('/api/debug/contracts/validate/tool-result', async (c) => {
    const body = await c.req.json()
    const result = await api.debug.contracts.validate.tool_result.handlePost({
      body,
    })
    return c.json(result)
  })
  app.get('/api/debug/environment', async (c) => {
    const result = await api.debug.environment.handleGet({})
    return c.json(result)
  })
  app.post('/api/debug/frontend-logs', async (c) => {
    const body = await c.req.json()
    const result = await api.debug.frontend_logs.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/debug/test/agent-run', async (c) => {
    const body = await c.req.json()
    const result = await api.debug.test.agent_run.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/debug/test/extract-file', async (c) => {
    const query = c.req.query()
    const body = await c.req.json()
    const result = await api.debug.test.extract_file.handlePost({ query, body })
    return c.json(result)
  })
  app.get('/api/debug/test/extractors', async (c) => {
    const result = await api.debug.test.extractors.handleGet({})
    return c.json(result)
  })
  app.post('/api/favorites/add', async (c) => {
    const body = await c.req.json()
    const result = await api.favorites.add.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/favorites/count', async (c) => {
    const body = await c.req.json()
    const result = await api.favorites.count.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/favorites/list', async (c) => {
    const body = await c.req.json()
    const result = await api.favorites.list.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/favorites/remove', async (c) => {
    const body = await c.req.json()
    const result = await api.favorites.remove.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/favorites/toggle', async (c) => {
    const body = await c.req.json()
    const result = await api.favorites.toggle.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/health-check', async (c) => {
    const result = await api.health_check.handleGet({})
    return c.json(result)
  })
  app.head('/api/health-check', async (c) => {
    const result = await api.health_check.handleHead({})
    return c.json(result)
  })
  app.post('/api/memory/add', async (c) => {
    const body = await c.req.json()
    const result = await api.memory.add.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/memory/delete', async (c) => {
    const body = await c.req.json()
    const result = await api.memory.delete.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/memory/list', async (c) => {
    const result = await api.memory.list.handlePost({})
    return c.json(result)
  })
  app.post('/api/memory/search', async (c) => {
    const body = await c.req.json()
    const result = await api.memory.search.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/memory/update', async (c) => {
    const body = await c.req.json()
    const result = await api.memory.update.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/memory/upload-document', async (c) => {
    const query = c.req.query()
    const body = await c.req.json()
    const result = await api.memory.upload_document.handlePost({ query, body })
    return c.json(result)
  })
  app.post('/api/message/add', async (c) => {
    const body = await c.req.json()
    const result = await api.message.add.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/message/add-chart', async (c) => {
    const body = await c.req.json()
    const result = await api.message.add_chart.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/message/add-theme', async (c) => {
    const body = await c.req.json()
    const result = await api.message.add_theme.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/message/list', async (c) => {
    const body = await c.req.json()
    const result = await api.message.list.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/project/:project_id/files', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await api.project._project_id.files.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.post('/api/project/:project_id/files', async (c) => {
    const params = c.req.param()
    const body = await c.req.json()
    const result = await api.project._project_id.files.handlePost({
      params,
      body,
    })
    return c.json(result)
  })
  app.delete('/api/project/:project_id/files', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await api.project._project_id.files.handleDelete({
      params,
      query,
    })
    return c.json(result)
  })
  app.post('/api/project/:project_id/files/batch-download', async (c) => {
    const params = c.req.param()
    const body = await c.req.json()
    const result =
      await api.project._project_id.files.batch_download.handlePost({
        params,
        body,
      })
    return c.json(result)
  })
  app.get('/api/project/:project_id/files/content', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const headers = Object.fromEntries(c.req.header())
    const result = await api.project._project_id.files.content.handleGet({
      params,
      query,
      headers,
    })
    return c.json(result)
  })
  app.get('/api/project/:project_id/files/docx', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const headers = Object.fromEntries(c.req.header())
    const result = await api.project._project_id.files.docx.handleGet({
      params,
      query,
      headers,
    })
    return c.json(result)
  })
  app.get('/api/project/:project_id/files/preview', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await api.project._project_id.files.preview.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.get('/api/project/:project_id/files/preview/stream', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const headers = Object.fromEntries(c.req.header())
    const result = await api.project._project_id.files.preview.stream.handleGet(
      { params, query, headers },
    )
    return c.json(result)
  })
  app.get('/api/project/:project_id/files/url', async (c) => {
    const params = c.req.param()
    const result = await api.project._project_id.files.url.handleGet({ params })
    return c.json(result)
  })
  app.post('/api/project/:project_id/onedrive/export', async (c) => {
    const params = c.req.param()
    const headers = Object.fromEntries(c.req.header())
    const body = await c.req.json()
    const result = await api.project._project_id.onedrive.export.handlePost({
      params,
      headers,
      body,
    })
    return c.json(result)
  })
  app.get('/api/project/:project_id/presentation', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const headers = Object.fromEntries(c.req.header())
    const result = await api.project._project_id.presentation.handleGet({
      params,
      query,
      headers,
    })
    return c.json(result)
  })
  app.get(
    '/api/project/:project_id/presentation/:sub_folder_path',
    async (c) => {
      const params = c.req.param()
      const query = c.req.query()
      const headers = Object.fromEntries(c.req.header())
      const result =
        await api.project._project_id.presentation._sub_folder_path.handleGet({
          params,
          query,
          headers,
        })
      return c.json(result)
    },
  )
  app.get('/api/project/:project_id/sandbox/url', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await api.project._project_id.sandbox.url.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.get('/api/project/:project_id/webappfiles', async (c) => {
    const params = c.req.param()
    const result = await api.project._project_id.webappfiles.handleGet({
      params,
    })
    return c.json(result)
  })
  app.post('/api/project/bulk-delete', async (c) => {
    const body = await c.req.json()
    const result = await api.project.bulk_delete.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/project/create', async (c) => {
    const body = await c.req.json()
    const result = await api.project.create.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/project/delete', async (c) => {
    const body = await c.req.json()
    const result = await api.project.delete.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/project/get', async (c) => {
    const body = await c.req.json()
    const result = await api.project.get.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/project/list', async (c) => {
    const result = await api.project.list.handlePost({})
    return c.json(result)
  })
  app.post('/api/project/update', async (c) => {
    const body = await c.req.json()
    const result = await api.project.update.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/projects/:project_id/files/info', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await api.projects._project_id.files.info.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.post('/api/projects/:project_id/files/upload', async (c) => {
    const params = c.req.param()
    const body = await c.req.json()
    const result = await api.projects._project_id.files.upload.handlePost({
      params,
      body,
    })
    return c.json(result)
  })
  app.post('/api/share/project/get', async (c) => {
    const body = await c.req.json()
    const result = await api.share.project.get.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/share/thread/get', async (c) => {
    const body = await c.req.json()
    const result = await api.share.thread.get.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/suggestions/generate', async (c) => {
    const body = await c.req.json()
    const result = await api.suggestions.generate.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/thread/:thread_id/agent-runs', async (c) => {
    const params = c.req.param()
    const result = await api.thread._thread_id.agent_runs.handlePost({ params })
    return c.json(result)
  })
  app.post('/api/thread/:thread_id/agent/start', async (c) => {
    const params = c.req.param()
    const body = await c.req.json()
    const result = await api.thread._thread_id.agent.start.handlePost({
      params,
      body,
    })
    return c.json(result)
  })
  app.post('/api/thread/create', async (c) => {
    const body = await c.req.json()
    const result = await api.thread.create.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/thread/get', async (c) => {
    const body = await c.req.json()
    const result = await api.thread.get.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/thread/list', async (c) => {
    const body = await c.req.json()
    const result = await api.thread.list.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/thread/search', async (c) => {
    const body = await c.req.json()
    const result = await api.thread.search.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/tools/check-video-status', async (c) => {
    const body = await c.req.json()
    const result = await api.tools.check_video_status.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/tools/list', async (c) => {
    const result = await api.tools.list.handleGet({})
    return c.json(result)
  })
  app.get('/api/triggers', async (c) => {
    const result = await api.triggers.handleGet({})
    return c.json(result)
  })
  app.post('/api/triggers', async (c) => {
    const body = await c.req.json()
    const result = await api.triggers.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/triggers/:trigger_id', async (c) => {
    const params = c.req.param()
    const result = await api.triggers._trigger_id.handleGet({ params })
    return c.json(result)
  })
  app.post('/api/triggers/:trigger_id', async (c) => {
    const params = c.req.param()
    const body = await c.req.json()
    const result = await api.triggers._trigger_id.handlePost({ params, body })
    return c.json(result)
  })
  app.post('/api/triggers/:trigger_id/delete', async (c) => {
    const params = c.req.param()
    const result = await api.triggers._trigger_id.delete.handlePost({ params })
    return c.json(result)
  })
  app.post('/api/triggers/:trigger_id/toggle', async (c) => {
    const params = c.req.param()
    const body = await c.req.json()
    const result = await api.triggers._trigger_id.toggle.handlePost({
      params,
      body,
    })
    return c.json(result)
  })
  app.post('/api/triggers/createScheduledTaskWithPrompt', async (c) => {
    const body = await c.req.json()
    const result = await api.triggers.createScheduledTaskWithPrompt.handlePost({
      body,
    })
    return c.json(result)
  })
  app.post('/api/triggers/webhook', async (c) => {
    const result = await api.triggers.webhook.handlePost({})
    return c.json(result)
  })
  app.get('/api/usage/admin/daily', async (c) => {
    const query = c.req.query()
    const result = await api.usage.admin.daily.handleGet({ query })
    return c.json(result)
  })
  app.get('/api/usage/admin/events', async (c) => {
    const query = c.req.query()
    const result = await api.usage.admin.events.handleGet({ query })
    return c.json(result)
  })
  app.get('/api/usage/admin/export', async (c) => {
    const query = c.req.query()
    const result = await api.usage.admin.export.handleGet({ query })
    return c.json(result)
  })
  app.get('/api/usage/admin/overview', async (c) => {
    const query = c.req.query()
    const result = await api.usage.admin.overview.handleGet({ query })
    return c.json(result)
  })
  app.get('/api/usage/admin/pricing', async (c) => {
    const result = await api.usage.admin.pricing.handleGet({})
    return c.json(result)
  })
  app.get('/api/usage/admin/quota', async (c) => {
    const result = await api.usage.admin.quota.handleGet({})
    return c.json(result)
  })
  app.get('/api/user/check-owner', async (c) => {
    const result = await api.user.check_owner.handleGet({})
    return c.json(result)
  })
  app.post('/api/user/create', async (c) => {
    const result = await api.user.create.handlePost({})
    return c.json(result)
  })
  app.post('/api/user/cred', async (c) => {
    const result = await api.user.cred.handlePost({})
    return c.json(result)
  })
  app.post('/api/user/delete-personal-data', async (c) => {
    const result = await api.user.delete_personal_data.handlePost({})
    return c.json(result)
  })
  app.get('/api/user/export-personal-data', async (c) => {
    const result = await api.user.export_personal_data.handleGet({})
    return c.json(result)
  })
  app.get('/api/user/gdpr-consent', async (c) => {
    const result = await api.user.gdpr_consent.handleGet({})
    return c.json(result)
  })
  app.post('/api/user/gdpr-consent', async (c) => {
    const body = await c.req.json()
    const result = await api.user.gdpr_consent.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/user/get', async (c) => {
    const result = await api.user.get.handlePost({})
    return c.json(result)
  })
  app.get('/api/user/preferences/file-summarization', async (c) => {
    const result = await api.user.preferences.file_summarization.handleGet({})
    return c.json(result)
  })
  app.post('/api/user/preferences/file-summarization', async (c) => {
    const body = await c.req.json()
    const result = await api.user.preferences.file_summarization.handlePost({
      body,
    })
    return c.json(result)
  })
  app.get('/api/user/skills', async (c) => {
    const result = await api.user.skills.handleGet({})
    return c.json(result)
  })
  app.get('/api/user/skills/:skill_name', async (c) => {
    const params = c.req.param()
    const result = await api.user.skills._skill_name.handleGet({ params })
    return c.json(result)
  })
  app.delete('/api/user/skills/:skill_name', async (c) => {
    const params = c.req.param()
    const result = await api.user.skills._skill_name.handleDelete({ params })
    return c.json(result)
  })
  app.post('/api/user/skills/toggle', async (c) => {
    const body = await c.req.json()
    const result = await api.user.skills.toggle.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/user/skills/upload', async (c) => {
    const body = await c.req.json()
    const result = await api.user.skills.upload.handlePost({ body })
    return c.json(result)
  })
  app.post('/api/user/update-throttle-rule', async (c) => {
    const body = await c.req.json()
    const result = await api.user.update_throttle_rule.handlePost({ body })
    return c.json(result)
  })
  app.get('/api/version', async (c) => {
    const result = await api.version.handleGet({})
    return c.json(result)
  })
  app.get('/api/workflow/:workflow_id/details', async (c) => {
    const params = c.req.param()
    const result = await api.workflow._workflow_id.details.handleGet({ params })
    return c.json(result)
  })
  app.get('/api/workflow/list', async (c) => {
    const result = await api.workflow.list.handleGet({})
    return c.json(result)
  })
  app.get('/debug', async (c) => {
    const result = await debug.handleGet({})
    return c.json(result)
  })
  app.get('/debug/agent-runs/:agent_run_id/analysis', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await debug.agent_runs._agent_run_id.analysis.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.get('/debug/agent-runs/:agent_run_id/events', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await debug.agent_runs._agent_run_id.events.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.get('/debug/agent-runs/:agent_run_id/traces', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await debug.agent_runs._agent_run_id.traces.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.post('/debug/chat', async (c) => {
    const body = await c.req.json()
    const result = await debug.chat.handlePost({ body })
    return c.json(result)
  })
  app.get('/debug/chat/suggestions', async (c) => {
    const result = await debug.chat.suggestions.handleGet({})
    return c.json(result)
  })
  app.get('/debug/critical-issues', async (c) => {
    const result = await debug.critical_issues.handleGet({})
    return c.json(result)
  })
  app.get('/debug/errors', async (c) => {
    const result = await debug.errors.handleGet({})
    return c.json(result)
  })
  app.post('/debug/events', async (c) => {
    const body = await c.req.json()
    const result = await debug.events.handlePost({ body })
    return c.json(result)
  })
  app.post('/debug/frontend-logs', async (c) => {
    const result = await debug.frontend_logs.handlePost({})
    return c.json(result)
  })
  app.get('/debug/frontend-telemetry', async (c) => {
    const query = c.req.query()
    const result = await debug.frontend_telemetry.handleGet({ query })
    return c.json(result)
  })
  app.post('/debug/frontend-telemetry', async (c) => {
    const result = await debug.frontend_telemetry.handlePost({})
    return c.json(result)
  })
  app.get('/debug/threads', async (c) => {
    const result = await debug.threads.handleGet({})
    return c.json(result)
  })
  app.get('/debug/threads/:thread_id/agent-runs', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await debug.threads._thread_id.agent_runs.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.get('/debug/threads/:thread_id/events', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await debug.threads._thread_id.events.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.get('/debug/threads/:thread_id/traces', async (c) => {
    const params = c.req.param()
    const query = c.req.query()
    const result = await debug.threads._thread_id.traces.handleGet({
      params,
      query,
    })
    return c.json(result)
  })
  app.post('/debug/threads/register', async (c) => {
    const result = await debug.threads.register.handlePost({})
    return c.json(result)
  })
  app.get('/debug/timeline/:thread_id', async (c) => {
    const params = c.req.param()
    const result = await debug.timeline._thread_id.handleGet({ params })
    return c.json(result)
  })
  app.get('/health', async (c) => {
    const result = await health.handleGet({})
    return c.json(result)
  })

  return app
}

export default decorate
