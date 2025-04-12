import packageJson from '../../package.json';

export const getVersion = () => packageJson.version;
export const getVersionWithV = () => `v${packageJson.version}`; 