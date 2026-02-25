const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  console.log('Seeding database...');

  try {
    await pool.query('BEGIN');

    // 1) Schema --------------------------------------------------------------
    const schemaSql = `
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS technologies (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS service_technologies (
      service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
      technology_id INT NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
      PRIMARY KEY (service_id, technology_id)
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INT DEFAULT 0
    );
    `;

    await pool.query(schemaSql);

    // 2) Clear old data ------------------------------------------------------
    await pool.query('DELETE FROM service_technologies');
    await pool.query('DELETE FROM faqs');
    await pool.query('DELETE FROM technologies');
    await pool.query('DELETE FROM services');

    // 3) Seed services (matches the reference URL sections) ------------------
    await pool.query(`
      INSERT INTO services (name, slug, summary, description, category, is_featured)
      VALUES
        (
          'Website Development',
          'website-development',
          'Responsive, conversion-focused e-commerce websites for web and mobile.',
          'We design and build custom e-commerce storefronts with intuitive navigation, fast checkout flows and SEO-friendly architecture tailored to each business.',
          'Website Development',
          TRUE
        ),
        (
          'Mobile App Development',
          'mobile-app-development',
          'Native and cross-platform e-commerce apps that keep customers engaged.',
          'We build mobile shopping experiences with personalised content, push notifications and secure in-app payments so customers can buy wherever they are.',
          'Mobile Apps',
          TRUE
        ),
        (
          'E-commerce Platform Integration',
          'ecommerce-platform-integration',
          'End-to-end integration of platforms, payment gateways and back-office systems.',
          'We connect your store with payment providers, inventory and order management, CRM and logistics systems so data flows reliably across your e-commerce ecosystem.',
          'Integrations',
          TRUE
        ),
        (
          'Digital Marketing Strategies',
          'digital-marketing-strategies',
          'Traffic and growth through SEO, PPC, email and social campaigns.',
          'We plan and execute data-driven digital marketing campaigns that attract, engage and convert your ideal customers across search, social and email.',
          'Marketing',
          FALSE
        ),
        (
          'Analytics & Conversion Optimization',
          'analytics-conversion-optimization',
          'Continuous optimisation of funnels, UX and merchandising using data.',
          'We instrument analytics, build dashboards and run experiments to improve conversion rates, average order value and customer lifetime value over time.',
          'Analytics',
          FALSE
        );
    `);

    // 4) Seed technologies (includes platforms mentioned on their site) -----
    await pool.query(`
      INSERT INTO technologies (name, category, description)
      VALUES
        ('Angular', 'Frontend', 'SPA framework used for rich e-commerce frontends.'),
        ('TailwindCSS', 'Frontend', 'Utility-first CSS for fast, consistent styling.'),
        ('TypeScript', 'Frontend', 'Typed layer on top of JavaScript for safer UIs.'),
        ('Node.js', 'Backend', 'Event-driven runtime powering the API layer.'),
        ('Express', 'Backend', 'Minimalist HTTP framework for Node.js services.'),
        ('PostgreSQL', 'Database', 'Relational database for transactional e-commerce data.'),
        ('BigCommerce', 'Platform', 'Cloud e-commerce platform we can integrate with.'),
        ('Magento', 'Platform', 'Enterprise-grade e-commerce platform.'),
        ('Shopify', 'Platform', 'Hosted e-commerce platform for fast go-to-market.'),
        ('Stripe', 'Payments', 'Online payment gateway for cards and wallets.'),
        ('PayPal', 'Payments', 'Widely used digital wallet and payment method.'),
        ('Google Analytics', 'Analytics', 'Tracking and insights for traffic and conversions.');
    `);

    // 5) Link services to technologies --------------------------------------
    // Website Development -> frontend + backend + DB
    await pool.query(`
      INSERT INTO service_technologies (service_id, technology_id)
      SELECT s.id, t.id
      FROM services s
      JOIN technologies t
        ON s.slug = 'website-development'
       AND t.name IN ('Angular', 'TailwindCSS', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL');
    `);

    // Mobile App Development -> backend, DB, payment gateways, analytics
    await pool.query(`
      INSERT INTO service_technologies (service_id, technology_id)
      SELECT s.id, t.id
      FROM services s
      JOIN technologies t
        ON s.slug = 'mobile-app-development'
       AND t.name IN ('Node.js', 'Express', 'PostgreSQL', 'Stripe', 'PayPal', 'Google Analytics');
    `);

    // E-commerce Platform Integration -> BigCommerce, Magento, Shopify, core stack
    await pool.query(`
      INSERT INTO service_technologies (service_id, technology_id)
      SELECT s.id, t.id
      FROM services s
      JOIN technologies t
        ON s.slug = 'ecommerce-platform-integration'
       AND t.name IN ('BigCommerce', 'Magento', 'Shopify', 'Node.js', 'PostgreSQL', 'Stripe');
    `);

    // Digital Marketing Strategies -> analytics + platforms
    await pool.query(`
      INSERT INTO service_technologies (service_id, technology_id)
      SELECT s.id, t.id
      FROM services s
      JOIN technologies t
        ON s.slug = 'digital-marketing-strategies'
       AND t.name IN ('Google Analytics', 'Shopify', 'BigCommerce', 'Magento');
    `);

    // Analytics & Conversion Optimization -> analytics + DB
    await pool.query(`
      INSERT INTO service_technologies (service_id, technology_id)
      SELECT s.id, t.id
      FROM services s
      JOIN technologies t
        ON s.slug = 'analytics-conversion-optimization'
       AND t.name IN ('Google Analytics', 'PostgreSQL');
    `);

    // 6) Seed FAQs -----------------------------------------------------------
    await pool.query(`
      INSERT INTO faqs (question, answer, sort_order)
      VALUES
        (
          'What types of e-commerce solutions do you deliver?',
          'We design and build custom e-commerce websites, mobile apps, platform integrations and analytics solutions tailored to each business stage.',
          1
        ),
        (
          'Which e-commerce platforms do you work with?',
          'We work with platforms such as BigCommerce, Magento, Shopify and fully custom solutions, choosing the best fit based on your business requirements.',
          2
        ),
        (
          'How do you handle security and compliance?',
          'We follow security best practices, use proven payment gateways and design architectures that support PCI-DSS and GDPR-compliant processing of customer data.',
          3
        ),
        (
          'How long does it take to launch a typical solution?',
          'Smaller e-commerce builds and integrations can go live in about 4–8 weeks, while larger, multi-channel implementations may take longer depending on scope.',
          4
        );
    `);

    await pool.query('COMMIT');
    console.log('✅ Database seeded successfully.');
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('❌ Error seeding database:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();