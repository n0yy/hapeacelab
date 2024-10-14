import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle PDF files if needed
    config.module.rules.push({
      test: /\.pdf$/,
      use: "null-loader",
    });

    return config;
  },
  images: {
    domains: ["cdn.trakteer.id"],
  },
};

export default withNextIntl(nextConfig);
