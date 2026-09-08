export interface VidoTheme {
    /** Image URL (SVG, raster or blob). Pass false for the plain progress dot. */
    avatar?: string | false;
    /** Any valid CSS color; defaults to neutral charcoal. */
    accent?: string;
    /** Disable the small companion animation. System reduced-motion always wins. */
    motion?: boolean;
}
export interface VidoTrack {
    src: string;
    srclang: string;
    label: string;
    default?: boolean;
}
export interface VidoOptions extends VidoTheme {
    el: HTMLElement | string;
    video?: HTMLVideoElement;
    src?: string;
    poster?: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    playsinline?: boolean;
    lang?: 'zh' | 'en';
    labels?: Partial<Record<keyof typeof strings.en, string>>;
    tracks?: VidoTrack[];
    w?: string | number;
    h?: string | number;
}
declare const strings: {
    en: {
        player: string;
        play: string;
        pause: string;
        seek: string;
        mute: string;
        unmute: string;
        volume: string;
        fullscreen: string;
        exitFullscreen: string;
        speed: string;
        captions: string;
        off: string;
        pip: string;
        exitPip: string;
        error: string;
        playDenied: string;
        unavailable: string;
        loading: string;
        retry: string;
        live: string;
    };
    zh: {
        player: string;
        play: string;
        pause: string;
        seek: string;
        mute: string;
        unmute: string;
        volume: string;
        fullscreen: string;
        exitFullscreen: string;
        speed: string;
        captions: string;
        off: string;
        pip: string;
        exitPip: string;
        error: string;
        playDenied: string;
        unavailable: string;
        loading: string;
        retry: string;
        live: string;
    };
};
/** Enhance a native video. Importing the module is safe during server rendering. */
export declare class Vido {
    readonly el: HTMLElement;
    readonly video: HTMLVideoElement;
    private readonly doc;
    private readonly labels;
    private readonly cleanup;
    private readonly shell;
    private readonly surface;
    private readonly seek;
    private readonly volume;
    private readonly playButton;
    private readonly muteButton;
    private readonly fullButton;
    private readonly pipButton;
    private readonly speed;
    private readonly captions;
    private readonly time;
    private readonly status;
    private readonly statusText;
    private readonly retry;
    private readonly marker;
    private readonly markerImage;
    private readonly supplied;
    private readonly placeholder?;
    private readonly originalVideoClass;
    private readonly originalRootAttributes;
    private readonly addedTracks;
    private destroyed;
    private playRequest;
    private pendingPlay;
    private generation;
    private errorVisible;
    constructor(options: VidoOptions);
    get src(): string;
    set src(value: string);
    /** Replace media and clear the old poster unless a new poster is supplied. */
    setSource(src: string, poster?: string): void;
    setTheme(theme: VidoTheme): void;
    destroy(): void;
    private node;
    private icon;
    private button;
    private range;
    private select;
    private option;
    private on;
    private message;
    private play;
    private toggle;
    private sync;
    private label;
    private syncCaptions;
    private bindEvents;
    private fullscreen;
    private pictureInPicture;
    private exitPresentation;
}
export default Vido;
