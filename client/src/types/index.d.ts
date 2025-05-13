declare global {
  interface HeroContent {
    id: string;
    subtitle: string;
    title: string;
    description: string;
    ctaText: string;
    backgroundImgUrl: string;
  }

  interface MissionContent {
    id: string;
    tagline: string;
    title: string;
    paragraph1Title: string;
    paragraph1Text: string;
    paragraph2Title: string;
    paragraph2Text: string;
    ctaLink: string;
    ctaText: string;
  }

  interface FeatureContent {
    id: string;
    iconName: string;
    title: string;
    description: string;
    ctaText: string;
    link: string;
    color: string;
    iconColor: string;
    hoverColor: string;
  }

  interface CtaContent {
    id: string;
    tagline: string;
    title: string;
    description: string;
    listItems: string[];
    buttonTextNotAuth: string;
    buttonTextAuth: string;
    backgroundImgUrl: string;
  }
}

export {};
