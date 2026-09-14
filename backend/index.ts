import {
  db,
  error,
  json,
  requireAdminEmailAllowlist,
  requireAuth,
  router,
} from '@appdeploy/sdk';

import { realtimeSubscriptionRoutes } from './realtime-subscribers';

const ADMIN_EMAILS = ['tomas.gajardo.mutis@gmail.com'];
const CONTENT_TABLE = 'site_content';

interface SiteContentRecord {
  content: Record<string, unknown>;
  updatedAt: string;
  ownerUserId: string;
}

async function readSiteContent() {
  const { items } = await db.list<SiteContentRecord>(CONTENT_TABLE, { limit: 1 });
  return items[0] ?? null;
}

export const handler = router({
  'GET /api/_healthcheck': [async () => json({ message: 'Success' })],

  'GET /api/site-content': [
    async () => {
      const current = await readSiteContent();
      return json({ content: current?.content ?? null, updatedAt: current?.updatedAt ?? null });
    },
  ],

  'GET /api/admin/status': [
    requireAuth(),
    requireAdminEmailAllowlist(ADMIN_EMAILS),
    async ctx => json({ ok: true, email: ctx.user?.email ?? '' }),
  ],

  'PUT /api/admin/site-content': [
    requireAuth(),
    requireAdminEmailAllowlist(ADMIN_EMAILS),
    async ctx => {
      const body = ctx.body as { content?: unknown };
      if (!body.content || typeof body.content !== 'object' || Array.isArray(body.content)) {
        return error('Contenido inválido', 400);
      }

      const serialized = JSON.stringify(body.content);
      if (serialized.length > 200000) {
        return error('El contenido es demasiado grande', 400);
      }

      const current = await readSiteContent();
      const record: SiteContentRecord = {
        content: body.content as Record<string, unknown>,
        updatedAt: new Date().toISOString(),
        ownerUserId: ctx.user!.userId,
      };

      if (current) {
        const [updated] = await db.update(CONTENT_TABLE, [{ id: current.id, record }]);
        if (!updated) return error('No se pudo guardar el contenido', 500);
      } else {
        const [id] = await db.add(CONTENT_TABLE, [record]);
        if (!id) return error('No se pudo crear el contenido', 500);
      }

      return json({ ok: true, content: record.content, updatedAt: record.updatedAt });
    },
  ],

  ...realtimeSubscriptionRoutes,
});
