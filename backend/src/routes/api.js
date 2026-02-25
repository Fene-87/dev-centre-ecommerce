const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/services
router.get('/services', async (req, res, next) => {
  try {
    const result = await db.query(
      `
      SELECT
        s.id,
        s.name,
        s.slug,
        s.summary,
        s.description,
        s.category,
        s.is_featured,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id,
              'name', t.name,
              'category', t.category
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS technologies
      FROM services s
      LEFT JOIN service_technologies st ON st.service_id = s.id
      LEFT JOIN technologies t ON t.id = st.technology_id
      GROUP BY s.id
      ORDER BY s.category, s.id;
      `
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/tech-stack
router.get('/tech-stack', async (req, res, next) => {
  try {
    const result = await db.query(
      `
      SELECT id, name, category, description
      FROM technologies
      ORDER BY category, name;
      `
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/faqs
router.get('/faqs', async (req, res, next) => {
  try {
    const result = await db.query(
      `
      SELECT id, question, answer
      FROM faqs
      ORDER BY sort_order, id;
      `
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;