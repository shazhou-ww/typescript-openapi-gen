// Auto-generated Express routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Router } from 'express'
import { api, debug, health } from './controller'

export const router = Router()

router.post('/api/admin/projects/bulk-delete', async (req, res, next) => {
  const body = req.body
  const result = await api.admin.projects.bulk_delete.handlePost({ body })
  res.json(result)
})
router.get('/api/admin/projects/count', async (req, res, next) => {
  const result = await api.admin.projects.count.handleGet({})
  res.json(result)
})
router.get('/api/admin/projects/list', async (req, res, next) => {
  const query = req.query
  const result = await api.admin.projects.list.handleGet({ query })
  res.json(result)
})
router.get('/api/admin/usage/overview', async (req, res, next) => {
  const query = req.query
  const result = await api.admin.usage.overview.handleGet({ query })
  res.json(result)
})
router.post('/api/agent-run/:agent_run_id', async (req, res, next) => {
  const params = req.params
  const result = await api.agent_run._agent_run_id.handlePost({ params })
  res.json(result)
})
router.post('/api/agent-run/:agent_run_id/stop', async (req, res, next) => {
  const params = req.params
  const result = await api.agent_run._agent_run_id.stop.handlePost({ params })
  res.json(result)
})
router.get('/api/agent-run/:agent_run_id/stream', async (req, res, next) => {
  const params = req.params
  const result = await api.agent_run._agent_run_id.stream.handleGet({ params })
  res.json(result)
})
router.post('/api/agent/quick-start', async (req, res, next) => {
  const body = req.body
  const result = await api.agent.quick_start.handlePost({ body })
  res.json(result)
})
router.post('/api/ai-presenter/avatar', async (req, res, next) => {
  const body = req.body
  const result = await api.ai_presenter.avatar.handlePost({ body })
  res.json(result)
})
router.post('/api/ai-presenter/generate_video', async (req, res, next) => {
  const body = req.body
  const result = await api.ai_presenter.generate_video.handlePost({ body })
  res.json(result)
})
router.get('/api/ai-presenter/list', async (req, res, next) => {
  const result = await api.ai_presenter.list.handleGet({})
  res.json(result)
})
router.get(
  '/api/ai-presenter/presentation_info/:project_id',
  async (req, res, next) => {
    const params = req.params
    const result =
      await api.ai_presenter.presentation_info._project_id.handleGet({ params })
    res.json(result)
  },
)
router.post('/api/ai-presenter/training', async (req, res, next) => {
  const body = req.body
  const result = await api.ai_presenter.training.handlePost({ body })
  res.json(result)
})
router.post('/api/ai-presenter/tts', async (req, res, next) => {
  const body = req.body
  const result = await api.ai_presenter.tts.handlePost({ body })
  res.json(result)
})
router.get(
  '/api/ai-presenter/video_status/:video_id',
  async (req, res, next) => {
    const params = req.params
    const result = await api.ai_presenter.video_status._video_id.handleGet({
      params,
    })
    res.json(result)
  },
)
router.get('/api/auth/google/callback', async (req, res, next) => {
  const query = req.query
  const result = await api.auth.google.callback.handleGet({ query })
  res.json(result)
})
router.post('/api/auth/google/initiate', async (req, res, next) => {
  const result = await api.auth.google.initiate.handlePost({})
  res.json(result)
})
router.post(
  '/api/connectors/:connector_id/authorize',
  async (req, res, next) => {
    const params = req.params
    const body = req.body
    const result = await api.connectors._connector_id.authorize.handlePost({
      params,
      body,
    })
    res.json(result)
  },
)
router.get('/api/connectors/:connector_id/callback', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await api.connectors._connector_id.callback.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.get(
  '/api/connectors/:connector_id/documents/:document_id',
  async (req, res, next) => {
    const params = req.params
    const query = req.query
    const result =
      await api.connectors._connector_id.documents._document_id.handleGet({
        params,
        query,
      })
    res.json(result)
  },
)
router.get('/api/connectors/:connector_id/files', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await api.connectors._connector_id.files.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.post('/api/connectors/:connector_id/files', async (req, res, next) => {
  const params = req.params
  const body = req.body
  const result = await api.connectors._connector_id.files.handlePost({
    params,
    body,
  })
  res.json(result)
})
router.get(
  '/api/connectors/:connector_id/files/search',
  async (req, res, next) => {
    const params = req.params
    const query = req.query
    const result = await api.connectors._connector_id.files.search.handleGet({
      params,
      query,
    })
    res.json(result)
  },
)
router.get('/api/connectors/activity', async (req, res, next) => {
  const query = req.query
  const result = await api.connectors.activity.handleGet({ query })
  res.json(result)
})
router.post('/api/connectors/approve', async (req, res, next) => {
  const body = req.body
  const result = await api.connectors.approve.handlePost({ body })
  res.json(result)
})
router.post('/api/connectors/disconnect', async (req, res, next) => {
  const body = req.body
  const result = await api.connectors.disconnect.handlePost({ body })
  res.json(result)
})
router.post('/api/connectors/execute', async (req, res, next) => {
  const body = req.body
  const result = await api.connectors.execute.handlePost({ body })
  res.json(result)
})
router.get('/api/connectors/list', async (req, res, next) => {
  const result = await api.connectors.list.handleGet({})
  res.json(result)
})
router.get('/api/debug/config/llm', async (req, res, next) => {
  const result = await api.debug.config.llm.handleGet({})
  res.json(result)
})
router.post('/api/debug/contracts/disable', async (req, res, next) => {
  const query = req.query
  const result = await api.debug.contracts.disable.handlePost({ query })
  res.json(result)
})
router.post('/api/debug/contracts/enable', async (req, res, next) => {
  const query = req.query
  const result = await api.debug.contracts.enable.handlePost({ query })
  res.json(result)
})
router.get('/api/debug/contracts/schemas', async (req, res, next) => {
  const result = await api.debug.contracts.schemas.handleGet({})
  res.json(result)
})
router.get(
  '/api/debug/contracts/schemas/:schema_path',
  async (req, res, next) => {
    const params = req.params
    const result = await api.debug.contracts.schemas._schema_path.handleGet({
      params,
    })
    res.json(result)
  },
)
router.get('/api/debug/contracts/status', async (req, res, next) => {
  const result = await api.debug.contracts.status.handleGet({})
  res.json(result)
})
router.post('/api/debug/contracts/toggle', async (req, res, next) => {
  const query = req.query
  const result = await api.debug.contracts.toggle.handlePost({ query })
  res.json(result)
})
router.post(
  '/api/debug/contracts/validate/api/:domain/:operation',
  async (req, res, next) => {
    const params = req.params
    const body = req.body
    const result =
      await api.debug.contracts.validate.api._domain._operation.handlePost({
        params,
        body,
      })
    res.json(result)
  },
)
router.post(
  '/api/debug/contracts/validate/entity/:entity_type',
  async (req, res, next) => {
    const params = req.params
    const body = req.body
    const result =
      await api.debug.contracts.validate.entity._entity_type.handlePost({
        params,
        body,
      })
    res.json(result)
  },
)
router.post(
  '/api/debug/contracts/validate/tool-call',
  async (req, res, next) => {
    const body = req.body
    const result = await api.debug.contracts.validate.tool_call.handlePost({
      body,
    })
    res.json(result)
  },
)
router.post(
  '/api/debug/contracts/validate/tool-result',
  async (req, res, next) => {
    const body = req.body
    const result = await api.debug.contracts.validate.tool_result.handlePost({
      body,
    })
    res.json(result)
  },
)
router.get('/api/debug/environment', async (req, res, next) => {
  const result = await api.debug.environment.handleGet({})
  res.json(result)
})
router.post('/api/debug/frontend-logs', async (req, res, next) => {
  const body = req.body
  const result = await api.debug.frontend_logs.handlePost({ body })
  res.json(result)
})
router.post('/api/debug/test/agent-run', async (req, res, next) => {
  const body = req.body
  const result = await api.debug.test.agent_run.handlePost({ body })
  res.json(result)
})
router.post('/api/debug/test/extract-file', async (req, res, next) => {
  const query = req.query
  const body = req.body
  const result = await api.debug.test.extract_file.handlePost({ query, body })
  res.json(result)
})
router.get('/api/debug/test/extractors', async (req, res, next) => {
  const result = await api.debug.test.extractors.handleGet({})
  res.json(result)
})
router.post('/api/favorites/add', async (req, res, next) => {
  const body = req.body
  const result = await api.favorites.add.handlePost({ body })
  res.json(result)
})
router.post('/api/favorites/count', async (req, res, next) => {
  const body = req.body
  const result = await api.favorites.count.handlePost({ body })
  res.json(result)
})
router.post('/api/favorites/list', async (req, res, next) => {
  const body = req.body
  const result = await api.favorites.list.handlePost({ body })
  res.json(result)
})
router.post('/api/favorites/remove', async (req, res, next) => {
  const body = req.body
  const result = await api.favorites.remove.handlePost({ body })
  res.json(result)
})
router.post('/api/favorites/toggle', async (req, res, next) => {
  const body = req.body
  const result = await api.favorites.toggle.handlePost({ body })
  res.json(result)
})
router.get('/api/health-check', async (req, res, next) => {
  const result = await api.health_check.handleGet({})
  res.json(result)
})
router.head('/api/health-check', async (req, res, next) => {
  const result = await api.health_check.handleHead({})
  res.json(result)
})
router.post('/api/memory/add', async (req, res, next) => {
  const body = req.body
  const result = await api.memory.add.handlePost({ body })
  res.json(result)
})
router.post('/api/memory/delete', async (req, res, next) => {
  const body = req.body
  const result = await api.memory.delete.handlePost({ body })
  res.json(result)
})
router.post('/api/memory/list', async (req, res, next) => {
  const result = await api.memory.list.handlePost({})
  res.json(result)
})
router.post('/api/memory/search', async (req, res, next) => {
  const body = req.body
  const result = await api.memory.search.handlePost({ body })
  res.json(result)
})
router.post('/api/memory/update', async (req, res, next) => {
  const body = req.body
  const result = await api.memory.update.handlePost({ body })
  res.json(result)
})
router.post('/api/memory/upload-document', async (req, res, next) => {
  const query = req.query
  const body = req.body
  const result = await api.memory.upload_document.handlePost({ query, body })
  res.json(result)
})
router.post('/api/message/add', async (req, res, next) => {
  const body = req.body
  const result = await api.message.add.handlePost({ body })
  res.json(result)
})
router.post('/api/message/add-chart', async (req, res, next) => {
  const body = req.body
  const result = await api.message.add_chart.handlePost({ body })
  res.json(result)
})
router.post('/api/message/add-theme', async (req, res, next) => {
  const body = req.body
  const result = await api.message.add_theme.handlePost({ body })
  res.json(result)
})
router.post('/api/message/list', async (req, res, next) => {
  const body = req.body
  const result = await api.message.list.handlePost({ body })
  res.json(result)
})
router.get('/api/project/:project_id/files', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await api.project._project_id.files.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.post('/api/project/:project_id/files', async (req, res, next) => {
  const params = req.params
  const body = req.body
  const result = await api.project._project_id.files.handlePost({
    params,
    body,
  })
  res.json(result)
})
router.delete('/api/project/:project_id/files', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await api.project._project_id.files.handleDelete({
    params,
    query,
  })
  res.json(result)
})
router.post(
  '/api/project/:project_id/files/batch-download',
  async (req, res, next) => {
    const params = req.params
    const body = req.body
    const result =
      await api.project._project_id.files.batch_download.handlePost({
        params,
        body,
      })
    res.json(result)
  },
)
router.get('/api/project/:project_id/files/content', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const headers = req.headers
  const result = await api.project._project_id.files.content.handleGet({
    params,
    query,
    headers,
  })
  res.json(result)
})
router.get('/api/project/:project_id/files/docx', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const headers = req.headers
  const result = await api.project._project_id.files.docx.handleGet({
    params,
    query,
    headers,
  })
  res.json(result)
})
router.get('/api/project/:project_id/files/preview', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await api.project._project_id.files.preview.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.get(
  '/api/project/:project_id/files/preview/stream',
  async (req, res, next) => {
    const params = req.params
    const query = req.query
    const headers = req.headers
    const result = await api.project._project_id.files.preview.stream.handleGet(
      { params, query, headers },
    )
    res.json(result)
  },
)
router.get('/api/project/:project_id/files/url', async (req, res, next) => {
  const params = req.params
  const result = await api.project._project_id.files.url.handleGet({ params })
  res.json(result)
})
router.post(
  '/api/project/:project_id/onedrive/export',
  async (req, res, next) => {
    const params = req.params
    const headers = req.headers
    const body = req.body
    const result = await api.project._project_id.onedrive.export.handlePost({
      params,
      headers,
      body,
    })
    res.json(result)
  },
)
router.get('/api/project/:project_id/presentation', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const headers = req.headers
  const result = await api.project._project_id.presentation.handleGet({
    params,
    query,
    headers,
  })
  res.json(result)
})
router.get(
  '/api/project/:project_id/presentation/:sub_folder_path',
  async (req, res, next) => {
    const params = req.params
    const query = req.query
    const headers = req.headers
    const result =
      await api.project._project_id.presentation._sub_folder_path.handleGet({
        params,
        query,
        headers,
      })
    res.json(result)
  },
)
router.get('/api/project/:project_id/sandbox/url', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await api.project._project_id.sandbox.url.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.get('/api/project/:project_id/webappfiles', async (req, res, next) => {
  const params = req.params
  const result = await api.project._project_id.webappfiles.handleGet({ params })
  res.json(result)
})
router.post('/api/project/bulk-delete', async (req, res, next) => {
  const body = req.body
  const result = await api.project.bulk_delete.handlePost({ body })
  res.json(result)
})
router.post('/api/project/create', async (req, res, next) => {
  const body = req.body
  const result = await api.project.create.handlePost({ body })
  res.json(result)
})
router.post('/api/project/delete', async (req, res, next) => {
  const body = req.body
  const result = await api.project.delete.handlePost({ body })
  res.json(result)
})
router.post('/api/project/get', async (req, res, next) => {
  const body = req.body
  const result = await api.project.get.handlePost({ body })
  res.json(result)
})
router.post('/api/project/list', async (req, res, next) => {
  const result = await api.project.list.handlePost({})
  res.json(result)
})
router.post('/api/project/update', async (req, res, next) => {
  const body = req.body
  const result = await api.project.update.handlePost({ body })
  res.json(result)
})
router.get('/api/projects/:project_id/files/info', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await api.projects._project_id.files.info.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.post(
  '/api/projects/:project_id/files/upload',
  async (req, res, next) => {
    const params = req.params
    const body = req.body
    const result = await api.projects._project_id.files.upload.handlePost({
      params,
      body,
    })
    res.json(result)
  },
)
router.post('/api/share/project/get', async (req, res, next) => {
  const body = req.body
  const result = await api.share.project.get.handlePost({ body })
  res.json(result)
})
router.post('/api/share/thread/get', async (req, res, next) => {
  const body = req.body
  const result = await api.share.thread.get.handlePost({ body })
  res.json(result)
})
router.post('/api/suggestions/generate', async (req, res, next) => {
  const body = req.body
  const result = await api.suggestions.generate.handlePost({ body })
  res.json(result)
})
router.post('/api/thread/:thread_id/agent-runs', async (req, res, next) => {
  const params = req.params
  const result = await api.thread._thread_id.agent_runs.handlePost({ params })
  res.json(result)
})
router.post('/api/thread/:thread_id/agent/start', async (req, res, next) => {
  const params = req.params
  const body = req.body
  const result = await api.thread._thread_id.agent.start.handlePost({
    params,
    body,
  })
  res.json(result)
})
router.post('/api/thread/create', async (req, res, next) => {
  const body = req.body
  const result = await api.thread.create.handlePost({ body })
  res.json(result)
})
router.post('/api/thread/get', async (req, res, next) => {
  const body = req.body
  const result = await api.thread.get.handlePost({ body })
  res.json(result)
})
router.post('/api/thread/list', async (req, res, next) => {
  const body = req.body
  const result = await api.thread.list.handlePost({ body })
  res.json(result)
})
router.post('/api/thread/search', async (req, res, next) => {
  const body = req.body
  const result = await api.thread.search.handlePost({ body })
  res.json(result)
})
router.post('/api/tools/check-video-status', async (req, res, next) => {
  const body = req.body
  const result = await api.tools.check_video_status.handlePost({ body })
  res.json(result)
})
router.get('/api/tools/list', async (req, res, next) => {
  const result = await api.tools.list.handleGet({})
  res.json(result)
})
router.get('/api/triggers', async (req, res, next) => {
  const result = await api.triggers.handleGet({})
  res.json(result)
})
router.post('/api/triggers', async (req, res, next) => {
  const body = req.body
  const result = await api.triggers.handlePost({ body })
  res.json(result)
})
router.get('/api/triggers/:trigger_id', async (req, res, next) => {
  const params = req.params
  const result = await api.triggers._trigger_id.handleGet({ params })
  res.json(result)
})
router.post('/api/triggers/:trigger_id', async (req, res, next) => {
  const params = req.params
  const body = req.body
  const result = await api.triggers._trigger_id.handlePost({ params, body })
  res.json(result)
})
router.post('/api/triggers/:trigger_id/delete', async (req, res, next) => {
  const params = req.params
  const result = await api.triggers._trigger_id.delete.handlePost({ params })
  res.json(result)
})
router.post('/api/triggers/:trigger_id/toggle', async (req, res, next) => {
  const params = req.params
  const body = req.body
  const result = await api.triggers._trigger_id.toggle.handlePost({
    params,
    body,
  })
  res.json(result)
})
router.post(
  '/api/triggers/createScheduledTaskWithPrompt',
  async (req, res, next) => {
    const body = req.body
    const result = await api.triggers.createScheduledTaskWithPrompt.handlePost({
      body,
    })
    res.json(result)
  },
)
router.post('/api/triggers/webhook', async (req, res, next) => {
  const result = await api.triggers.webhook.handlePost({})
  res.json(result)
})
router.get('/api/usage/admin/daily', async (req, res, next) => {
  const query = req.query
  const result = await api.usage.admin.daily.handleGet({ query })
  res.json(result)
})
router.get('/api/usage/admin/events', async (req, res, next) => {
  const query = req.query
  const result = await api.usage.admin.events.handleGet({ query })
  res.json(result)
})
router.get('/api/usage/admin/export', async (req, res, next) => {
  const query = req.query
  const result = await api.usage.admin.export.handleGet({ query })
  res.json(result)
})
router.get('/api/usage/admin/overview', async (req, res, next) => {
  const query = req.query
  const result = await api.usage.admin.overview.handleGet({ query })
  res.json(result)
})
router.get('/api/usage/admin/pricing', async (req, res, next) => {
  const result = await api.usage.admin.pricing.handleGet({})
  res.json(result)
})
router.get('/api/usage/admin/quota', async (req, res, next) => {
  const result = await api.usage.admin.quota.handleGet({})
  res.json(result)
})
router.get('/api/user/check-owner', async (req, res, next) => {
  const result = await api.user.check_owner.handleGet({})
  res.json(result)
})
router.post('/api/user/create', async (req, res, next) => {
  const result = await api.user.create.handlePost({})
  res.json(result)
})
router.post('/api/user/cred', async (req, res, next) => {
  const result = await api.user.cred.handlePost({})
  res.json(result)
})
router.post('/api/user/delete-personal-data', async (req, res, next) => {
  const result = await api.user.delete_personal_data.handlePost({})
  res.json(result)
})
router.get('/api/user/export-personal-data', async (req, res, next) => {
  const result = await api.user.export_personal_data.handleGet({})
  res.json(result)
})
router.get('/api/user/gdpr-consent', async (req, res, next) => {
  const result = await api.user.gdpr_consent.handleGet({})
  res.json(result)
})
router.post('/api/user/gdpr-consent', async (req, res, next) => {
  const body = req.body
  const result = await api.user.gdpr_consent.handlePost({ body })
  res.json(result)
})
router.post('/api/user/get', async (req, res, next) => {
  const result = await api.user.get.handlePost({})
  res.json(result)
})
router.get(
  '/api/user/preferences/file-summarization',
  async (req, res, next) => {
    const result = await api.user.preferences.file_summarization.handleGet({})
    res.json(result)
  },
)
router.post(
  '/api/user/preferences/file-summarization',
  async (req, res, next) => {
    const body = req.body
    const result = await api.user.preferences.file_summarization.handlePost({
      body,
    })
    res.json(result)
  },
)
router.get('/api/user/skills', async (req, res, next) => {
  const result = await api.user.skills.handleGet({})
  res.json(result)
})
router.get('/api/user/skills/:skill_name', async (req, res, next) => {
  const params = req.params
  const result = await api.user.skills._skill_name.handleGet({ params })
  res.json(result)
})
router.delete('/api/user/skills/:skill_name', async (req, res, next) => {
  const params = req.params
  const result = await api.user.skills._skill_name.handleDelete({ params })
  res.json(result)
})
router.post('/api/user/skills/toggle', async (req, res, next) => {
  const body = req.body
  const result = await api.user.skills.toggle.handlePost({ body })
  res.json(result)
})
router.post('/api/user/skills/upload', async (req, res, next) => {
  const body = req.body
  const result = await api.user.skills.upload.handlePost({ body })
  res.json(result)
})
router.post('/api/user/update-throttle-rule', async (req, res, next) => {
  const body = req.body
  const result = await api.user.update_throttle_rule.handlePost({ body })
  res.json(result)
})
router.get('/api/version', async (req, res, next) => {
  const result = await api.version.handleGet({})
  res.json(result)
})
router.get('/api/workflow/:workflow_id/details', async (req, res, next) => {
  const params = req.params
  const result = await api.workflow._workflow_id.details.handleGet({ params })
  res.json(result)
})
router.get('/api/workflow/list', async (req, res, next) => {
  const result = await api.workflow.list.handleGet({})
  res.json(result)
})
router.get('/debug', async (req, res, next) => {
  const result = await debug.handleGet({})
  res.json(result)
})
router.get(
  '/debug/agent-runs/:agent_run_id/analysis',
  async (req, res, next) => {
    const params = req.params
    const query = req.query
    const result = await debug.agent_runs._agent_run_id.analysis.handleGet({
      params,
      query,
    })
    res.json(result)
  },
)
router.get('/debug/agent-runs/:agent_run_id/events', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await debug.agent_runs._agent_run_id.events.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.get('/debug/agent-runs/:agent_run_id/traces', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await debug.agent_runs._agent_run_id.traces.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.post('/debug/chat', async (req, res, next) => {
  const body = req.body
  const result = await debug.chat.handlePost({ body })
  res.json(result)
})
router.get('/debug/chat/suggestions', async (req, res, next) => {
  const result = await debug.chat.suggestions.handleGet({})
  res.json(result)
})
router.get('/debug/critical-issues', async (req, res, next) => {
  const result = await debug.critical_issues.handleGet({})
  res.json(result)
})
router.get('/debug/errors', async (req, res, next) => {
  const result = await debug.errors.handleGet({})
  res.json(result)
})
router.post('/debug/events', async (req, res, next) => {
  const body = req.body
  const result = await debug.events.handlePost({ body })
  res.json(result)
})
router.post('/debug/frontend-logs', async (req, res, next) => {
  const result = await debug.frontend_logs.handlePost({})
  res.json(result)
})
router.get('/debug/frontend-telemetry', async (req, res, next) => {
  const query = req.query
  const result = await debug.frontend_telemetry.handleGet({ query })
  res.json(result)
})
router.post('/debug/frontend-telemetry', async (req, res, next) => {
  const result = await debug.frontend_telemetry.handlePost({})
  res.json(result)
})
router.get('/debug/threads', async (req, res, next) => {
  const result = await debug.threads.handleGet({})
  res.json(result)
})
router.get('/debug/threads/:thread_id/agent-runs', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await debug.threads._thread_id.agent_runs.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.get('/debug/threads/:thread_id/events', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await debug.threads._thread_id.events.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.get('/debug/threads/:thread_id/traces', async (req, res, next) => {
  const params = req.params
  const query = req.query
  const result = await debug.threads._thread_id.traces.handleGet({
    params,
    query,
  })
  res.json(result)
})
router.post('/debug/threads/register', async (req, res, next) => {
  const result = await debug.threads.register.handlePost({})
  res.json(result)
})
router.get('/debug/timeline/:thread_id', async (req, res, next) => {
  const params = req.params
  const result = await debug.timeline._thread_id.handleGet({ params })
  res.json(result)
})
router.get('/health', async (req, res, next) => {
  const result = await health.handleGet({})
  res.json(result)
})

export default router
