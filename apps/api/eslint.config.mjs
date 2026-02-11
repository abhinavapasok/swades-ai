import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...config,
    {
        rules: {
            "no-console": "off", // Allowed for the API server
        },
    },
];
