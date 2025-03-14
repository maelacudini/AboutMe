import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withPlaiceholder from "@plaiceholder/next";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
                port: '',
                pathname: '**',
            },
        ],
    },
};

const exportWithNextIntl = withNextIntl(nextConfig)

export default withPlaiceholder(exportWithNextIntl);
