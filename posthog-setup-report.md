<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your **DevEvent** Next.js App Router project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client.ts` pattern. Configured with a reverse-proxy API host (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development. API key and host are loaded from environment variables.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set securely; covered by `.gitignore`.
- **`next.config.ts`** (updated): Added PostHog reverse-proxy rewrites (`/ingest/static/*` and `/ingest/*`) and `skipTrailingSlashRedirect: true` to support PostHog's trailing-slash API requests. This improves ad-blocker bypass and keeps analytics data flowing.
- **`components/ExploreBtn.tsx`** (updated): Added `posthog.capture('explore_events_clicked')` in the click handler of the Explore Events CTA button.
- **`components/EventCard.tsx`** (updated): Converted to a client component and added `posthog.capture('event_card_clicked', { event_title, event_slug, event_location, event_date })` on card click, capturing rich event metadata.
- **`components/NavBar.tsx`** (updated): Converted to a client component and added `posthog.capture('nav_link_clicked', { link_label })` on each nav link click.
- **`components/FeaturedEventsTracker.tsx`** (new): Lightweight client component that fires `posthog.capture('featured_events_viewed', { event_count })` when the featured events section renders — tracking the top of the discovery funnel.
- **`app/page.tsx`** (updated): Imported and rendered `<FeaturedEventsTracker>` within the featured events section.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `featured_events_viewed` | User lands on the home page and sees the featured events section (top of discovery funnel) | `components/FeaturedEventsTracker.tsx` |
| `explore_events_clicked` | User clicks the "Explore Events" CTA button on the home page | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details; includes `event_title`, `event_slug`, `event_location`, `event_date` | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks on a navigation link in the header; includes `link_label` | `components/NavBar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/321952/dashboard/1303002
- **Event Discovery Funnel** (conversion funnel: viewed → explore clicked → card clicked): https://us.posthog.com/project/321952/insights/DVihfWCj
- **Daily Active Users (Event Engagement)** (daily unique users per key action): https://us.posthog.com/project/321952/insights/GHqrE6nF
- **Most Popular Event Cards Clicked** (which events attract the most clicks): https://us.posthog.com/project/321952/insights/2YXt7sqx
- **Navigation Link Clicks** (pie chart of nav link usage): https://us.posthog.com/project/321952/insights/ScOCyeEr
- **Explore CTA Click Rate** (weekly page views vs. explore CTA clicks): https://us.posthog.com/project/321952/insights/p1Ad3C09

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
