# Deploy from a phone with Vercel

This is a personal portfolio and can use Vercel's free Hobby plan, subject to the plan's current terms and usage limits. You do not need a custom domain or a terminal for these steps.

1. Open [Vercel](https://vercel.com/new) in your phone's browser and sign up or log in with GitHub. Use your personal Hobby account.
2. In **Import Git Repository**, connect GitHub if prompted. Grant access to `sarthaklive9967-ship-it/sound-portfolio`; if it is missing, check the Vercel GitHub app's repository access.
3. Choose **Import** next to `sound-portfolio`. Use branch `main` if a branch selector is shown.
4. Keep **Framework Preset: Next.js**, **Root Directory: repository root** (usually `./`), and the detected install/build/output settings. The app is at the repository root, not in a second `sound-portfolio` subfolder. Use a supported Node.js version; Node.js 24 was used for verification.
5. Click **Deploy**. Once the deployment is ready, use **Visit** or the project's **Domains** section to open and copy the actual public HTTPS URL. Vercel chooses the available domain; no particular hostname is assumed here.
6. Finish metadata setup: in the project's **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` with the actual production origin, such as the exact `https://…vercel.app` address shown by Vercel. Use the stable project domain, not a deployment-specific preview URL. Set it for **Production**. If the site origin was already known before deployment, you can add it during import instead.
7. Open **Deployments**, open the menu for the latest production deployment, and choose **Redeploy**. Environment changes need a new build; they do not change a completed deployment.
8. Open the website again and check navigation, mobile menu, sculpture, and GitHub links. Copy the production URL from **Domains** to share your site.

The first deployment works before step 6, but canonical/social-image/sitemap URLs are only correct after setting the origin and rebuilding. If you later attach a different domain, update the variable and redeploy again.

If controls are difficult to find on a phone, try landscape orientation or your browser's **Desktop site** option. Vercel may rename dashboard labels, so use the corresponding import, project settings, environment-variable, deployment, and domain screens.

Once Git integration is connected, later pushes to the configured production branch normally trigger another production deployment. Check that branch under the project's Git/Environment settings if needed. No deployment was created automatically by the coding task.
