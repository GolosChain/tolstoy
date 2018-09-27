import React from 'react';
import { LIQUID_TOKEN } from 'app/client_config';
import config from 'config';

const APPLE_ICON_SIZES = [
    '57x57',
    '60x60',
    '72x72',
    '76x76',
    '114x114',
    '120x120',
    '144x144',
    '152x152',
];

export default function ServerHTML({ body, title, assets, helmet, meta }) {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                {helmet && helmet.title ? helmet.title.toComponent() : <title>{title}</title>}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                {meta ? renderMeta(meta) : null}
                <link rel="manifest" href="/static/manifest.json" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                {APPLE_ICON_SIZES.map(size => (
                    <link
                        key={size}
                        rel="apple-touch-icon-precomposed"
                        type="image/png"
                        sizes={size}
                        href={`/images/favicons/apple-icon-${size}.png`}
                    />
                ))}
                {/*<link rel="icon" type="image/png" href="/images/favicons/favicon-196x196.png" sizes="196x196" />*/}
                <link
                    rel="icon"
                    type="image/png"
                    href="/images/favicons/favicon-96x96.png"
                    sizes="96x96"
                />
                <link
                    rel="icon"
                    type="image/png"
                    href="/images/favicons/favicon-32x32.png"
                    sizes="32x32"
                />
                <link
                    rel="icon"
                    type="image/png"
                    href="/images/favicons/favicon-16x16.png"
                    sizes="16x16"
                />
                {/*<link rel="icon" type="image/png" href="/images/favicons/favicon-128.png" sizes="128x128" />*/}
                <meta name="application-name" content={LIQUID_TOKEN} />
                <meta name="msapplication-TileColor" content="#FFFFFF" />
                <meta
                    name="msapplication-TileImage"
                    content="/images/favicons/ms-icon-144x144.png"
                />
                <meta
                    name="msapplication-square70x70logo"
                    content="/images/favicons/ms-icon-70x70.png"
                />
                <meta
                    name="msapplication-square150x150logo"
                    content="/images/favicons/ms-icon-150x150.png"
                />
                <meta
                    name="msapplication-wide310x150logo"
                    content="/images/favicons/ms-icon-310x150.png"
                />
                <meta
                    name="msapplication-square310x310logo"
                    content="/images/favicons/ms-icon-310x310.png"
                />

                {/* styles (will be present only in production with webpack extract text plugin) */}
                {Object.keys(assets.styles).map((style, i) => (
                    <link
                        href={assets.styles[style]}
                        key={i}
                        media="screen, projection"
                        rel="stylesheet"
                        type="text/css"
                    />
                ))}

                {/* resolves the initial style flash (flicker) on page load in development mode */}
                {Object.keys(assets.styles).length === 0 ? (
                    <style dangerouslySetInnerHTML={{ __html: '#content{visibility:hidden}' }} />
                ) : null}
            </head>
            <body>
                <div id="content" dangerouslySetInnerHTML={{ __html: body }} />

                {/* javascripts */}
                {/* (usually one for each "entry" in webpack configuration) */}
                {/* (for more informations on "entries" see https://github.com/petehunt/webpack-howto/) */}
                {Object.keys(assets.javascript).map((script, i) => (
                    <script src={assets.javascript[script]} key={i} />
                ))}

                {config.get('vk_pixel_id') && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `(window.Image ? (new Image()) : document.createElement('img')).src = 'https://vk.com/rtrg?p=${config.get(
                                'vk_pixel_id'
                            )}';`,
                        }}
                    />
                )}
            </body>
        </html>
    );
}

function renderMeta(meta) {
    return meta.map(m => {
        if (m.canonical) {
            return <link key="canonical" rel="canonical" href={m.canonical} />;
        }
        if (m.name && m.content) {
            return <meta key={m.name} name={m.name} content={m.content} />;
        }
        if (m.property && m.content) {
            return <meta key={m.property} property={m.property} content={m.content} />;
        }
        if (m.name && m.content) {
            return <meta key={m.name} name={m.name} content={m.content} />;
        }
    });
}
