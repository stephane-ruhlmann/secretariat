import { config } from 'dotenv';

config();

const isSecure = (process.env.SECURE || 'true') === 'true';

const userStatusOptions = [
  { label: 'Indépendant', value: 'independent' },
  {
    label:
      'Administration (fonctionnaire ou sous contrat stage, alternance, CDD ou CDI)',
    value: 'admin',
  },
  { label: 'Société de service', value: 'service' },
];

const userBadgeOptions = [{ label: 'Ségur (Paris)', value: 'segur' }];

export default {
  secret: process.env.SESSION_SECRET,
  secure: isSecure,
  protocol: isSecure ? 'https' : 'http',
  host: process.env.HOSTNAME,
  port: process.env.PORT || 8100,
  domain: process.env.SECRETARIAT_DOMAIN || 'beta.gouv.fr',
  newsletterTemplateId: process.env.NEWSLETTER_TEMPLATE_ID,
  newsletterSentDay: process.env.NEWSLETTER_SENT_DAY || 'THURSDAY',
  padURL: process.env.PAD_URL || 'https://pad.incubateur.net',
  padEmail: process.env.PAD_USERNAME,
  padPassword: process.env.PAD_PASSWORD,
  user: {
    statusOptions: userStatusOptions,
    minStartDate: '2013-07-01',
    badgeOptions: userBadgeOptions,
  },
  newsletterBroadcastList:
    process.env.NEWSLETTER_BROADCAST_LIST || 'secretariat@beta.gouv.fr',
  newsletterCronTime: process.env.NEWSLETTER_CRON_TIME || '0 4 * * 5',
  newsletterHashSecret: process.env.NEWSLETTER_HASH_SECRET,
  newsletterSendTime: process.env.NEWSLETTER_SEND_TIME,
  senderEmail: process.env.MAIL_SENDER || 'secretariat@incubateur.net',
  slackWebhookURLSecretariat: process.env.SLACK_WEBHOOK_URL_SECRETARIAT,
  slackWebhookURLGeneral: process.env.SLACK_WEBHOOK_URL_GENERAL,
  usersAPI:
    process.env.USERS_API || 'https://beta.gouv.fr/api/v2.1/authors.json',
  startupsAPI:
    process.env.STARTUPS_API || 'https://beta.gouv.fr/api/v2/startups.json',
  githubToken: process.env.GITHUB_TOKEN,
  githubOrganizationName: process.env.GITHUB_ORGANIZATION_NAME || 'betagouv',
  githubOrgAdminToken: process.env.GITHUB_ORG_ADMIN_TOKEN,
  githubRepository: process.env.GITHUB_REPOSITORY,
  githubFork: process.env.GITHUB_FORK,
  githubBetagouvTeam: process.env.GITHUB_BETAGOUV_TEAM || 'beta-gouv-fr',
  defaultLoggedInRedirectUrl: '/account',
  visitRecipientEmail:
    process.env.VISIT_MAIL_RECIPIENT || 'secretariat@incubateur.net',
  visitSenderEmail: process.env.VISIT_MAIL_SENDER || 'secretariat@beta.gouv.fr',
  sentryDNS: process.env.SENTRY_DNS || false,
  mattermostBotToken: process.env.MATTERMOST_BOT_TOKEN,
  mattermostTeamId: process.env.MATTERMOST_TEAM_ID || 'testteam',
  mattermostAlumniTeamId:
    process.env.MATTERMOST_ALUMNI_TEAM_ID || 'testalumniteam',
  mattermostInvitationLink: process.env.MATTERMOST_INVITATION_LINK || '',
  mattermostInviteId: process.env.MATTERMOST_INVITE_ID,
  investigationReportsIframeURL:
    process.env.INVESTIGATION_REPORTS_IFRAME_URL || '',
  leavesEmail: process.env.LEAVES_EMAIL || 'depart@beta.gouv.fr',
  featureReinitPasswordEmail:
    process.env.FEATURE_REINIT_PASSWORD_EMAIL || false,
  featureReactiveMattermostUsers:
    process.env.FEATURE_REACTIVE_MATTERMOST_USERS || false,
  featureAddGithubUserToOrganization:
    process.env.FEATURE_ADD_GITHUB_USER_TO_ORGANIZATION,
  featureCreateUserOnMattermost: process.env.FEATURE_CREATE_USER_ON_MATTERMOST,
  featureRemoveGithubUserFromOrganization:
    process.env.FEATURE_REMOVE_GITHUB_USER_FROM_ORGANIZATION,
  featureOnUserContractEnd: process.env.FEATURE_ON_USER_CONTRACT_END,
  featureAddExpiredUsersToAlumniOnMattermost:
    process.env.FEATURE_ADD_EXPIRED_USERS_TO_ALUMNI_ON_MATTERMOST,
  featureRemoveExpiredUsersFromCommunityOnMattermost: process.env.FEATURE_REMOVED_EXPIRED_USERS_FROM_COMMUNITY_ON_MATTERMOST,
  featureSendJ1Email: process.env.FEATURE_SEND_J1_EMAIL,
  featureSendJ30Email: process.env.FEATURE_SEND_J30_EMAIL,
  featureDeleteOVHEmailAccounts: process.env.FEATURE_DELETE_OVH_EMAIL_ACCOUNTS,
  featureDeleteSecondaryEmail: process.env.FEATURE_DELETE_SECONDARY_EMAIL,
  featureDeleteRedirectionsAfterQuitting:
    process.env.FEATURE_DELETE_REDIRECTIONS_AFTER_QUITTING,
  featureRemoveEmailsFromMailingList: process.env.FEATURE_REMOVE_EMAILS_FROM_MAILING_LIST
};