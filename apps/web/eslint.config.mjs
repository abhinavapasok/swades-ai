import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...config,
    {
        rules: {
            "react/react-in-jsx-scope": "off",
        },
    },
];
