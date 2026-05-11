interface Env {
  bouquet_db: D1Database;
}

export async function onRequestGet(context: {
  params: { id: string };
  env: Env;
}) {
  try {
    const id = context.params.id;

    const row = await context.env.bouquet_db
      .prepare(
        `
        SELECT *
        FROM bouquets
        WHERE id = ?
      `
      )
      .bind(id)
      .first();

    if (!row) {
      return Response.json(
        {
          success: false,
          error: "Bouquet not found",
        },
        {
          status: 404,
        }
      );
    }

    await context.env.bouquet_db
      .prepare(
        `
        UPDATE bouquets
        SET views = views + 1
        WHERE id = ?
      `
      )
      .bind(id)
      .run();

    return Response.json({
      success: true,
      bouquet: JSON.parse(
        row.payload as string
      ),
      views: row.views,
    });
  } catch (err) {
    return Response.json(
      {
        success: false,
        error: String(err),
      },
      {
        status: 500,
      }
    );
  }
}