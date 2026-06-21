import { mountSocialLanding } from "./mount-social-landing.js";
import { getSocialPlatformPage } from "./platform-pages.js";

const slug = document.body.dataset.platform;
mountSocialLanding(getSocialPlatformPage(slug));
