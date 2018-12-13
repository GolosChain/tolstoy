// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'Голос';
export const APP_NAME_LATIN = 'Golos';
export const TITLE_SUFFIX = 'Golos.io';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_UP = 'GOLOS.io';
export const APP_ICON = 'golos';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_DOMAIN = 'golos.io';
export const APP_URL = 'https://golos.io';
export const LIQUID_TOKEN = 'Голос';

export const CURRENCY_SIGN = '₽≈';

// these are dealing with asset types, not displaying to client, rather sending data over websocket
export const LIQUID_TICKER = 'GOLOS';
export const VEST_TICKER = 'GESTS';
export const DEBT_TICKER = 'GBG';
export const DEBT_TOKEN_SHORT = 'GBG';

// application settings
export const DEFAULT_LANGUAGE = 'ru';
export const LOCALE_COOKIE_KEY = 'gls.locale';
export const LOCALE_COOKIE_EXPIRES = new Date(Date.now() + 315360000000); // 10 years
export const LANGUAGES = {
    ru: {
        value: 'Русский',
        shortValue: 'RU',
    },
    en: {
        value: 'English',
        shortValue: 'EN',
    },
    /* in react-intl they use 'uk' instead of 'ua' */
    uk: {
        value: 'Українська',
        shortValue: 'UA',
    },
};
// First element always is USD, it needs to be correct fetch yahoo exchange rates from server side
export const CURRENCIES = ['USD', 'RUB', 'EUR', DEBT_TOKEN_SHORT, LIQUID_TICKER];
export const DEFAULT_CURRENCY = 'RUB';

// meta info
export const TWITTER_HANDLE = '@goloschain';
export const SHARE_IMAGE = 'https://' + APP_DOMAIN + '/images/golos-share.png';
export const TWITTER_SHARE_IMAGE = 'https://' + APP_DOMAIN + '/images/golos-twshare.png';
export const SITE_DESCRIPTION =
    'Голос - социальная сеть, построенная на публичном блокчейне. Вознаграждение пользователей осуществляется за счет дополнительной эмиссии токенов. При этом распределением токенов управляют текущие пользователи сети через голосование за лучший контент.';

// registration
export const REGISTRATION_URL = 'https://reg.golos.io/';

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;
export const SUPPORT_EMAIL_2 = 'pr@golos.io';
// ignore special tags, dev-tags, partners tags
export const IGNORE_TAGS = ['bm-open', 'bm-ceh23', 'bm-tasks', 'bm-taskceh1'];
export const PUBLIC_API = {
    created: 'getDiscussionsByCreatedAsync',
    recent: 'getDiscussionsByCreatedAsync',
    hot: 'getDiscussionsByHotAsync',
    trending: 'getDiscussionsByTrendingAsync',
    promoted: 'getDiscussionsByPromotedAsync',
    active: 'getDiscussionsByActiveAsync',
    responses: 'getDiscussionsByChildrenAsync',
    votes: 'getDiscussionsByVotesAsync',
    cashout: 'getDiscussionsByCashoutAsync',
    payout: 'getDiscussionsByPayoutAsync',
    feed: 'getDiscussionsByFeedAsync',
};
export const ACCOUNT_OPERATIONS = [
    'transfer_to_vesting',
    'withdraw_vesting',
    'interest',
    'transfer',
    'convert',
    'fill_convert_request',
    'transfer_to_savings',
    'transfer_from_savings',
    'cancel_transfer_from_savings',
];

export const SEO_TITLE = 'GOLOS.io Блоги';

export const USER_GENDER = ['undefined', 'male', 'female'];

export const SMS_SERVICES = {
    default: '+46769438807',
    '7': '+79169306359',
    '77': '+77770076977',
    '375': '+375292308770',
    '380': '+380931777772',
};

export const ANDROID_APP_NAME = 'Golos.io';
export const ANDROID_PACKAGE = 'io.golos.golos';
export const ANDROID_URL_SCHEME = 'golosioapp';
export const ANDROID_DEEP_LINK_DOMAIN = 'golos.io';
export const TERMS_OF_SERVICE_URL = 'https://golos.io/legal/terms_of_service.pdf';
export const WIKI_URL = 'https://wiki.golos.io/';
export const MARKDOWN_STYLING_GUIDE_URL =
    'https://golos.io/ru--golos/@on0tole/osnovy-oformleniya-postov-na-golose-polnyi-kurs-po-rabote-s-markdown';

export const MIN_VOICE_POWER = 3;

export const DEFAULT_VOTE_LIMIT = 10000;

export const LEAVE_PAGE_WHITELIST_DOMAINS = [
    'golos.io',
    'golos.blog',
    'golostools.com',
    'github.com',
    'play.google.com',
    'tlg.name',
    'facebook.com',
    'vk.com',
    'instagram.com',
    'twitter.com',
    'explorer.golos.io',
    'kuna.com.ua',
    'forklog.com',
    'steepshot.io',
    'goldvoice.club',
    'golos.today',
    'cpeda.space',
    'linkedin.com',
];

export const DONATION_FOR = 'Donation for';

export const AMPLITUDE_SESSION = 'amplitudeSession';
