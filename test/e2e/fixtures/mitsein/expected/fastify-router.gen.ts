// Auto-generated Fastify routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import ssePlugin from '@fastify/sse'
import { api, debug, health } from './controller'

/**
 * Decorates a Fastify instance with generated routes.
 * Usage: await decorate(fastify)
 */
export async function decorate(fastify: FastifyInstance): Promise<void> {
  fastify.register(ssePlugin)
  fastify.withTypeProvider<TypeBoxTypeProvider>()
  fastify.post('/api/admin/projects/bulk-delete', async (request, reply) => {
    const body = request.body
    const result = await api.admin.projects.bulk_delete.handlePost({ body })
    return result
  })
  fastify.get('/api/admin/projects/count', async (request, reply) => {
    const result = await api.admin.projects.count.handleGet({})
    return result
  })
  fastify.get('/api/admin/projects/list', async (request, reply) => {
    const query = request.query
    const result = await api.admin.projects.list.handleGet({ query })
    return result
  })
  fastify.get('/api/admin/usage/overview', async (request, reply) => {
    const query = request.query
    const result = await api.admin.usage.overview.handleGet({ query })
    return result
  })
  fastify.post('/api/agent-run/:agent_run_id', async (request, reply) => {
    const params = request.params
    const result = await api.agent_run._agent_run_id.handlePost({ params })
    return result
  })
  fastify.post('/api/agent-run/:agent_run_id/stop', async (request, reply) => {
    const params = request.params
    const result = await api.agent_run._agent_run_id.stop.handlePost({ params })
    return result
  })
  fastify.get('/api/agent-run/:agent_run_id/stream', async (request, reply) => {
    const params = request.params
    const result = await api.agent_run._agent_run_id.stream.handleGet({
      params,
    })
    return result
  })
  fastify.post('/api/agent/quick-start', async (request, reply) => {
    const body = request.body
    const result = await api.agent.quick_start.handlePost({ body })
    return result
  })
  fastify.post('/api/ai-presenter/avatar', async (request, reply) => {
    const body = request.body
    const result = await api.ai_presenter.avatar.handlePost({ body })
    return result
  })
  fastify.post('/api/ai-presenter/generate_video', async (request, reply) => {
    const body = request.body
    const result = await api.ai_presenter.generate_video.handlePost({ body })
    return result
  })
  fastify.get('/api/ai-presenter/list', async (request, reply) => {
    const result = await api.ai_presenter.list.handleGet({})
    return result
  })
  fastify.get(
    '/api/ai-presenter/presentation_info/:project_id',
    async (request, reply) => {
      const params = request.params
      const result =
        await api.ai_presenter.presentation_info._project_id.handleGet({
          params,
        })
      return result
    },
  )
  fastify.post('/api/ai-presenter/training', async (request, reply) => {
    const body = request.body
    const result = await api.ai_presenter.training.handlePost({ body })
    return result
  })
  fastify.post('/api/ai-presenter/tts', async (request, reply) => {
    const body = request.body
    const result = await api.ai_presenter.tts.handlePost({ body })
    return result
  })
  fastify.get(
    '/api/ai-presenter/video_status/:video_id',
    async (request, reply) => {
      const params = request.params
      const result = await api.ai_presenter.video_status._video_id.handleGet({
        params,
      })
      return result
    },
  )
  fastify.get('/api/auth/google/callback', async (request, reply) => {
    const query = request.query
    const result = await api.auth.google.callback.handleGet({ query })
    return result
  })
  fastify.post('/api/auth/google/initiate', async (request, reply) => {
    const result = await api.auth.google.initiate.handlePost({})
    return result
  })
  fastify.post(
    '/api/connectors/:connector_id/authorize',
    async (request, reply) => {
      const params = request.params
      const body = request.body
      const result = await api.connectors._connector_id.authorize.handlePost({
        params,
        body,
      })
      return result
    },
  )
  fastify.get(
    '/api/connectors/:connector_id/callback',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result = await api.connectors._connector_id.callback.handleGet({
        params,
        query,
      })
      return result
    },
  )
  fastify.get(
    '/api/connectors/:connector_id/documents/:document_id',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result =
        await api.connectors._connector_id.documents._document_id.handleGet({
          params,
          query,
        })
      return result
    },
  )
  fastify.get('/api/connectors/:connector_id/files', async (request, reply) => {
    const params = request.params
    const query = request.query
    const result = await api.connectors._connector_id.files.handleGet({
      params,
      query,
    })
    return result
  })
  fastify.post(
    '/api/connectors/:connector_id/files',
    async (request, reply) => {
      const params = request.params
      const body = request.body
      const result = await api.connectors._connector_id.files.handlePost({
        params,
        body,
      })
      return result
    },
  )
  fastify.get(
    '/api/connectors/:connector_id/files/search',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result = await api.connectors._connector_id.files.search.handleGet({
        params,
        query,
      })
      return result
    },
  )
  fastify.get('/api/connectors/activity', async (request, reply) => {
    const query = request.query
    const result = await api.connectors.activity.handleGet({ query })
    return result
  })
  fastify.post('/api/connectors/approve', async (request, reply) => {
    const body = request.body
    const result = await api.connectors.approve.handlePost({ body })
    return result
  })
  fastify.post('/api/connectors/disconnect', async (request, reply) => {
    const body = request.body
    const result = await api.connectors.disconnect.handlePost({ body })
    return result
  })
  fastify.post('/api/connectors/execute', async (request, reply) => {
    const body = request.body
    const result = await api.connectors.execute.handlePost({ body })
    return result
  })
  fastify.get('/api/connectors/list', async (request, reply) => {
    const result = await api.connectors.list.handleGet({})
    return result
  })
  fastify.get('/api/debug/config/llm', async (request, reply) => {
    const result = await api.debug.config.llm.handleGet({})
    return result
  })
  fastify.post('/api/debug/contracts/disable', async (request, reply) => {
    const query = request.query
    const result = await api.debug.contracts.disable.handlePost({ query })
    return result
  })
  fastify.post('/api/debug/contracts/enable', async (request, reply) => {
    const query = request.query
    const result = await api.debug.contracts.enable.handlePost({ query })
    return result
  })
  fastify.get('/api/debug/contracts/schemas', async (request, reply) => {
    const result = await api.debug.contracts.schemas.handleGet({})
    return result
  })
  fastify.get(
    '/api/debug/contracts/schemas/:schema_path',
    async (request, reply) => {
      const params = request.params
      const result = await api.debug.contracts.schemas._schema_path.handleGet({
        params,
      })
      return result
    },
  )
  fastify.get('/api/debug/contracts/status', async (request, reply) => {
    const result = await api.debug.contracts.status.handleGet({})
    return result
  })
  fastify.post('/api/debug/contracts/toggle', async (request, reply) => {
    const query = request.query
    const result = await api.debug.contracts.toggle.handlePost({ query })
    return result
  })
  fastify.post(
    '/api/debug/contracts/validate/api/:domain/:operation',
    async (request, reply) => {
      const params = request.params
      const body = request.body
      const result =
        await api.debug.contracts.validate.api._domain._operation.handlePost({
          params,
          body,
        })
      return result
    },
  )
  fastify.post(
    '/api/debug/contracts/validate/entity/:entity_type',
    async (request, reply) => {
      const params = request.params
      const body = request.body
      const result =
        await api.debug.contracts.validate.entity._entity_type.handlePost({
          params,
          body,
        })
      return result
    },
  )
  fastify.post(
    '/api/debug/contracts/validate/tool-call',
    async (request, reply) => {
      const body = request.body
      const result = await api.debug.contracts.validate.tool_call.handlePost({
        body,
      })
      return result
    },
  )
  fastify.post(
    '/api/debug/contracts/validate/tool-result',
    async (request, reply) => {
      const body = request.body
      const result = await api.debug.contracts.validate.tool_result.handlePost({
        body,
      })
      return result
    },
  )
  fastify.get('/api/debug/environment', async (request, reply) => {
    const result = await api.debug.environment.handleGet({})
    return result
  })
  fastify.post('/api/debug/frontend-logs', async (request, reply) => {
    const body = request.body
    const result = await api.debug.frontend_logs.handlePost({ body })
    return result
  })
  fastify.post('/api/debug/test/agent-run', async (request, reply) => {
    const body = request.body
    const result = await api.debug.test.agent_run.handlePost({ body })
    return result
  })
  fastify.post('/api/debug/test/extract-file', async (request, reply) => {
    const query = request.query
    const body = request.body
    const result = await api.debug.test.extract_file.handlePost({ query, body })
    return result
  })
  fastify.get('/api/debug/test/extractors', async (request, reply) => {
    const result = await api.debug.test.extractors.handleGet({})
    return result
  })
  fastify.post('/api/favorites/add', async (request, reply) => {
    const body = request.body
    const result = await api.favorites.add.handlePost({ body })
    return result
  })
  fastify.post('/api/favorites/count', async (request, reply) => {
    const body = request.body
    const result = await api.favorites.count.handlePost({ body })
    return result
  })
  fastify.post('/api/favorites/list', async (request, reply) => {
    const body = request.body
    const result = await api.favorites.list.handlePost({ body })
    return result
  })
  fastify.post('/api/favorites/remove', async (request, reply) => {
    const body = request.body
    const result = await api.favorites.remove.handlePost({ body })
    return result
  })
  fastify.post('/api/favorites/toggle', async (request, reply) => {
    const body = request.body
    const result = await api.favorites.toggle.handlePost({ body })
    return result
  })
  fastify.get('/api/health-check', async (request, reply) => {
    const result = await api.health_check.handleGet({})
    return result
  })
  fastify.head('/api/health-check', async (request, reply) => {
    const result = await api.health_check.handleHead({})
    return result
  })
  fastify.post('/api/memory/add', async (request, reply) => {
    const body = request.body
    const result = await api.memory.add.handlePost({ body })
    return result
  })
  fastify.post('/api/memory/delete', async (request, reply) => {
    const body = request.body
    const result = await api.memory.delete.handlePost({ body })
    return result
  })
  fastify.post('/api/memory/list', async (request, reply) => {
    const result = await api.memory.list.handlePost({})
    return result
  })
  fastify.post('/api/memory/search', async (request, reply) => {
    const body = request.body
    const result = await api.memory.search.handlePost({ body })
    return result
  })
  fastify.post('/api/memory/update', async (request, reply) => {
    const body = request.body
    const result = await api.memory.update.handlePost({ body })
    return result
  })
  fastify.post('/api/memory/upload-document', async (request, reply) => {
    const query = request.query
    const body = request.body
    const result = await api.memory.upload_document.handlePost({ query, body })
    return result
  })
  fastify.post('/api/message/add', async (request, reply) => {
    const body = request.body
    const result = await api.message.add.handlePost({ body })
    return result
  })
  fastify.post('/api/message/add-chart', async (request, reply) => {
    const body = request.body
    const result = await api.message.add_chart.handlePost({ body })
    return result
  })
  fastify.post('/api/message/add-theme', async (request, reply) => {
    const body = request.body
    const result = await api.message.add_theme.handlePost({ body })
    return result
  })
  fastify.post('/api/message/list', async (request, reply) => {
    const body = request.body
    const result = await api.message.list.handlePost({ body })
    return result
  })
  fastify.get('/api/project/:project_id/files', async (request, reply) => {
    const params = request.params
    const query = request.query
    const result = await api.project._project_id.files.handleGet({
      params,
      query,
    })
    return result
  })
  fastify.post('/api/project/:project_id/files', async (request, reply) => {
    const params = request.params
    const body = request.body
    const result = await api.project._project_id.files.handlePost({
      params,
      body,
    })
    return result
  })
  fastify.delete('/api/project/:project_id/files', async (request, reply) => {
    const params = request.params
    const query = request.query
    const result = await api.project._project_id.files.handleDelete({
      params,
      query,
    })
    return result
  })
  fastify.post(
    '/api/project/:project_id/files/batch-download',
    async (request, reply) => {
      const params = request.params
      const body = request.body
      const result =
        await api.project._project_id.files.batch_download.handlePost({
          params,
          body,
        })
      return result
    },
  )
  fastify.get(
    '/api/project/:project_id/files/content',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const headers = request.headers
      const result = await api.project._project_id.files.content.handleGet({
        params,
        query,
        headers,
      })
      return result
    },
  )
  fastify.get('/api/project/:project_id/files/docx', async (request, reply) => {
    const params = request.params
    const query = request.query
    const headers = request.headers
    const result = await api.project._project_id.files.docx.handleGet({
      params,
      query,
      headers,
    })
    return result
  })
  fastify.get(
    '/api/project/:project_id/files/preview',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result = await api.project._project_id.files.preview.handleGet({
        params,
        query,
      })
      return result
    },
  )
  fastify.get(
    '/api/project/:project_id/files/preview/stream',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const headers = request.headers
      const result =
        await api.project._project_id.files.preview.stream.handleGet({
          params,
          query,
          headers,
        })
      return result
    },
  )
  fastify.get('/api/project/:project_id/files/url', async (request, reply) => {
    const params = request.params
    const result = await api.project._project_id.files.url.handleGet({ params })
    return result
  })
  fastify.post(
    '/api/project/:project_id/onedrive/export',
    async (request, reply) => {
      const params = request.params
      const headers = request.headers
      const body = request.body
      const result = await api.project._project_id.onedrive.export.handlePost({
        params,
        headers,
        body,
      })
      return result
    },
  )
  fastify.get(
    '/api/project/:project_id/presentation',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const headers = request.headers
      const result = await api.project._project_id.presentation.handleGet({
        params,
        query,
        headers,
      })
      return result
    },
  )
  fastify.get(
    '/api/project/:project_id/presentation/:sub_folder_path',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const headers = request.headers
      const result =
        await api.project._project_id.presentation._sub_folder_path.handleGet({
          params,
          query,
          headers,
        })
      return result
    },
  )
  fastify.get(
    '/api/project/:project_id/sandbox/url',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result = await api.project._project_id.sandbox.url.handleGet({
        params,
        query,
      })
      return result
    },
  )
  fastify.get(
    '/api/project/:project_id/webappfiles',
    async (request, reply) => {
      const params = request.params
      const result = await api.project._project_id.webappfiles.handleGet({
        params,
      })
      return result
    },
  )
  fastify.post('/api/project/bulk-delete', async (request, reply) => {
    const body = request.body
    const result = await api.project.bulk_delete.handlePost({ body })
    return result
  })
  fastify.post('/api/project/create', async (request, reply) => {
    const body = request.body
    const result = await api.project.create.handlePost({ body })
    return result
  })
  fastify.post('/api/project/delete', async (request, reply) => {
    const body = request.body
    const result = await api.project.delete.handlePost({ body })
    return result
  })
  fastify.post('/api/project/get', async (request, reply) => {
    const body = request.body
    const result = await api.project.get.handlePost({ body })
    return result
  })
  fastify.post('/api/project/list', async (request, reply) => {
    const result = await api.project.list.handlePost({})
    return result
  })
  fastify.post('/api/project/update', async (request, reply) => {
    const body = request.body
    const result = await api.project.update.handlePost({ body })
    return result
  })
  fastify.get(
    '/api/projects/:project_id/files/info',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result = await api.projects._project_id.files.info.handleGet({
        params,
        query,
      })
      return result
    },
  )
  fastify.post(
    '/api/projects/:project_id/files/upload',
    async (request, reply) => {
      const params = request.params
      const body = request.body
      const result = await api.projects._project_id.files.upload.handlePost({
        params,
        body,
      })
      return result
    },
  )
  fastify.post('/api/share/project/get', async (request, reply) => {
    const body = request.body
    const result = await api.share.project.get.handlePost({ body })
    return result
  })
  fastify.post('/api/share/thread/get', async (request, reply) => {
    const body = request.body
    const result = await api.share.thread.get.handlePost({ body })
    return result
  })
  fastify.post('/api/suggestions/generate', async (request, reply) => {
    const body = request.body
    const result = await api.suggestions.generate.handlePost({ body })
    return result
  })
  fastify.post('/api/thread/:thread_id/agent-runs', async (request, reply) => {
    const params = request.params
    const result = await api.thread._thread_id.agent_runs.handlePost({ params })
    return result
  })
  fastify.post('/api/thread/:thread_id/agent/start', async (request, reply) => {
    const params = request.params
    const body = request.body
    const result = await api.thread._thread_id.agent.start.handlePost({
      params,
      body,
    })
    return result
  })
  fastify.post('/api/thread/create', async (request, reply) => {
    const body = request.body
    const result = await api.thread.create.handlePost({ body })
    return result
  })
  fastify.post('/api/thread/get', async (request, reply) => {
    const body = request.body
    const result = await api.thread.get.handlePost({ body })
    return result
  })
  fastify.post('/api/thread/list', async (request, reply) => {
    const body = request.body
    const result = await api.thread.list.handlePost({ body })
    return result
  })
  fastify.post('/api/thread/search', async (request, reply) => {
    const body = request.body
    const result = await api.thread.search.handlePost({ body })
    return result
  })
  fastify.post('/api/tools/check-video-status', async (request, reply) => {
    const body = request.body
    const result = await api.tools.check_video_status.handlePost({ body })
    return result
  })
  fastify.get('/api/tools/list', async (request, reply) => {
    const result = await api.tools.list.handleGet({})
    return result
  })
  fastify.get('/api/triggers', async (request, reply) => {
    const result = await api.triggers.handleGet({})
    return result
  })
  fastify.post('/api/triggers', async (request, reply) => {
    const body = request.body
    const result = await api.triggers.handlePost({ body })
    return result
  })
  fastify.get('/api/triggers/:trigger_id', async (request, reply) => {
    const params = request.params
    const result = await api.triggers._trigger_id.handleGet({ params })
    return result
  })
  fastify.post('/api/triggers/:trigger_id', async (request, reply) => {
    const params = request.params
    const body = request.body
    const result = await api.triggers._trigger_id.handlePost({ params, body })
    return result
  })
  fastify.post('/api/triggers/:trigger_id/delete', async (request, reply) => {
    const params = request.params
    const result = await api.triggers._trigger_id.delete.handlePost({ params })
    return result
  })
  fastify.post('/api/triggers/:trigger_id/toggle', async (request, reply) => {
    const params = request.params
    const body = request.body
    const result = await api.triggers._trigger_id.toggle.handlePost({
      params,
      body,
    })
    return result
  })
  fastify.post(
    '/api/triggers/createScheduledTaskWithPrompt',
    async (request, reply) => {
      const body = request.body
      const result =
        await api.triggers.createScheduledTaskWithPrompt.handlePost({ body })
      return result
    },
  )
  fastify.post('/api/triggers/webhook', async (request, reply) => {
    const result = await api.triggers.webhook.handlePost({})
    return result
  })
  fastify.get('/api/usage/admin/daily', async (request, reply) => {
    const query = request.query
    const result = await api.usage.admin.daily.handleGet({ query })
    return result
  })
  fastify.get('/api/usage/admin/events', async (request, reply) => {
    const query = request.query
    const result = await api.usage.admin.events.handleGet({ query })
    return result
  })
  fastify.get('/api/usage/admin/export', async (request, reply) => {
    const query = request.query
    const result = await api.usage.admin.export.handleGet({ query })
    return result
  })
  fastify.get('/api/usage/admin/overview', async (request, reply) => {
    const query = request.query
    const result = await api.usage.admin.overview.handleGet({ query })
    return result
  })
  fastify.get('/api/usage/admin/pricing', async (request, reply) => {
    const result = await api.usage.admin.pricing.handleGet({})
    return result
  })
  fastify.get('/api/usage/admin/quota', async (request, reply) => {
    const result = await api.usage.admin.quota.handleGet({})
    return result
  })
  fastify.get('/api/user/check-owner', async (request, reply) => {
    const result = await api.user.check_owner.handleGet({})
    return result
  })
  fastify.post('/api/user/create', async (request, reply) => {
    const result = await api.user.create.handlePost({})
    return result
  })
  fastify.post('/api/user/cred', async (request, reply) => {
    const result = await api.user.cred.handlePost({})
    return result
  })
  fastify.post('/api/user/delete-personal-data', async (request, reply) => {
    const result = await api.user.delete_personal_data.handlePost({})
    return result
  })
  fastify.get('/api/user/export-personal-data', async (request, reply) => {
    const result = await api.user.export_personal_data.handleGet({})
    return result
  })
  fastify.get('/api/user/gdpr-consent', async (request, reply) => {
    const result = await api.user.gdpr_consent.handleGet({})
    return result
  })
  fastify.post('/api/user/gdpr-consent', async (request, reply) => {
    const body = request.body
    const result = await api.user.gdpr_consent.handlePost({ body })
    return result
  })
  fastify.post('/api/user/get', async (request, reply) => {
    const result = await api.user.get.handlePost({})
    return result
  })
  fastify.get(
    '/api/user/preferences/file-summarization',
    async (request, reply) => {
      const result = await api.user.preferences.file_summarization.handleGet({})
      return result
    },
  )
  fastify.post(
    '/api/user/preferences/file-summarization',
    async (request, reply) => {
      const body = request.body
      const result = await api.user.preferences.file_summarization.handlePost({
        body,
      })
      return result
    },
  )
  fastify.get('/api/user/skills', async (request, reply) => {
    const result = await api.user.skills.handleGet({})
    return result
  })
  fastify.get('/api/user/skills/:skill_name', async (request, reply) => {
    const params = request.params
    const result = await api.user.skills._skill_name.handleGet({ params })
    return result
  })
  fastify.delete('/api/user/skills/:skill_name', async (request, reply) => {
    const params = request.params
    const result = await api.user.skills._skill_name.handleDelete({ params })
    return result
  })
  fastify.post('/api/user/skills/toggle', async (request, reply) => {
    const body = request.body
    const result = await api.user.skills.toggle.handlePost({ body })
    return result
  })
  fastify.post('/api/user/skills/upload', async (request, reply) => {
    const body = request.body
    const result = await api.user.skills.upload.handlePost({ body })
    return result
  })
  fastify.post('/api/user/update-throttle-rule', async (request, reply) => {
    const body = request.body
    const result = await api.user.update_throttle_rule.handlePost({ body })
    return result
  })
  fastify.get('/api/version', async (request, reply) => {
    const result = await api.version.handleGet({})
    return result
  })
  fastify.get('/api/workflow/:workflow_id/details', async (request, reply) => {
    const params = request.params
    const result = await api.workflow._workflow_id.details.handleGet({ params })
    return result
  })
  fastify.get('/api/workflow/list', async (request, reply) => {
    const result = await api.workflow.list.handleGet({})
    return result
  })
  fastify.get('/debug', async (request, reply) => {
    const result = await debug.handleGet({})
    return result
  })
  fastify.get(
    '/debug/agent-runs/:agent_run_id/analysis',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result = await debug.agent_runs._agent_run_id.analysis.handleGet({
        params,
        query,
      })
      return result
    },
  )
  fastify.get(
    '/debug/agent-runs/:agent_run_id/events',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result = await debug.agent_runs._agent_run_id.events.handleGet({
        params,
        query,
      })
      return result
    },
  )
  fastify.get(
    '/debug/agent-runs/:agent_run_id/traces',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result = await debug.agent_runs._agent_run_id.traces.handleGet({
        params,
        query,
      })
      return result
    },
  )
  fastify.post('/debug/chat', async (request, reply) => {
    const body = request.body
    const result = await debug.chat.handlePost({ body })
    return result
  })
  fastify.get('/debug/chat/suggestions', async (request, reply) => {
    const result = await debug.chat.suggestions.handleGet({})
    return result
  })
  fastify.get('/debug/critical-issues', async (request, reply) => {
    const result = await debug.critical_issues.handleGet({})
    return result
  })
  fastify.get('/debug/errors', async (request, reply) => {
    const result = await debug.errors.handleGet({})
    return result
  })
  fastify.post('/debug/events', async (request, reply) => {
    const body = request.body
    const result = await debug.events.handlePost({ body })
    return result
  })
  fastify.post('/debug/frontend-logs', async (request, reply) => {
    const result = await debug.frontend_logs.handlePost({})
    return result
  })
  fastify.get('/debug/frontend-telemetry', async (request, reply) => {
    const query = request.query
    const result = await debug.frontend_telemetry.handleGet({ query })
    return result
  })
  fastify.post('/debug/frontend-telemetry', async (request, reply) => {
    const result = await debug.frontend_telemetry.handlePost({})
    return result
  })
  fastify.get('/debug/threads', async (request, reply) => {
    const result = await debug.threads.handleGet({})
    return result
  })
  fastify.get(
    '/debug/threads/:thread_id/agent-runs',
    async (request, reply) => {
      const params = request.params
      const query = request.query
      const result = await debug.threads._thread_id.agent_runs.handleGet({
        params,
        query,
      })
      return result
    },
  )
  fastify.get('/debug/threads/:thread_id/events', async (request, reply) => {
    const params = request.params
    const query = request.query
    const result = await debug.threads._thread_id.events.handleGet({
      params,
      query,
    })
    return result
  })
  fastify.get('/debug/threads/:thread_id/traces', async (request, reply) => {
    const params = request.params
    const query = request.query
    const result = await debug.threads._thread_id.traces.handleGet({
      params,
      query,
    })
    return result
  })
  fastify.post('/debug/threads/register', async (request, reply) => {
    const result = await debug.threads.register.handlePost({})
    return result
  })
  fastify.get('/debug/timeline/:thread_id', async (request, reply) => {
    const params = request.params
    const result = await debug.timeline._thread_id.handleGet({ params })
    return result
  })
  fastify.get('/health', async (request, reply) => {
    const result = await health.handleGet({})
    return result
  })
}

export default decorate
