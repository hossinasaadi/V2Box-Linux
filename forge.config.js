module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: [
        "darwin"
      ]
    },

    {
      name: '@electron-forge/maker-deb',
      config: {},
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'hossinasaadi',
          name: 'V2Box-Linux'
        },
        prerelease: true
      }
    }
  ]
};
